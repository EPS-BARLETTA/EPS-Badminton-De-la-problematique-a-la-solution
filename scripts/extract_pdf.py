#!/usr/bin/env python3
"""Extract exercises, text content, and images from the EPS badminton PDF."""
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import fitz

CATEGORY_HEADERS = {
    "METTRE EN JEU EFFICACEMENT": {
        "id": "mettre-en-jeu-efficacement",
        "title": "Mettre en jeu efficacement",
        "description": "Trouver des mises en jeu précises et variées pour lancer l'échange avec un avantage.",
    },
    "RÉALISER UN RETOUR DE SERVICE EFFICACE": {
        "id": "realiser-un-retour-de-service-efficace",
        "title": "Réaliser un retour de service efficace",
        "description": "Répondre à tous les types de services en gardant l'initiative tactique.",
    },
    "ROMPRE L’ÉCHANGE PAR L’ESPACE": {
        "id": "rompre-echange-espace",
        "title": "Rompre l’échange par l’espace",
        "description": "Exploiter la largeur et la profondeur du terrain pour déplacer l'adversaire.",
    },
    "ROMPRE L’ÉCHANGE PAR LA VITESSE": {
        "id": "rompre-echange-vitesse",
        "title": "Rompre l’échange par la vitesse",
        "description": "Accélérer le tempo de l'échange pour limiter le temps de réaction adverse.",
    },
    "EXPLOITER LA SITUATION FAVORABLE": {
        "id": "exploiter-situation-favorable",
        "title": "Identifier / exploiter la situation favorable",
        "description": "Lire le rapport de force et choisir le coup qui conclut ou sécurise l'avantage.",
    },
}

HEADING_TITLES = {
    "OBJECTIF DE LA SITUATION": "objective",
    "BUT DE LA SITUATION": "goal",
    "CONSIGNES": "instructions",
    "VARIANTES": "variants",
    "DIMENSION TECHNICO-TACTIQUE": "dimension",
}

SECTION_SKIP = {
    "SITUATION GLOBALE",
    "> RETOUR AU SOMMAIRE",
}


def slugify(value: str) -> str:
    value = value.lower()
    replacements = {
        "é": "e",
        "è": "e",
        "ê": "e",
        "à": "a",
        "â": "a",
        "ù": "u",
        "û": "u",
        "ô": "o",
        "î": "i",
        "ï": "i",
        "ç": "c",
        "'": "-",
        "’": "-",
        "/": "-",
    }
    for src, target in replacements.items():
        value = value.replace(src, target)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def clean_section(text: str, collapse: bool = False) -> List[str] | str:
    text = text.replace("\x07", " ").strip()
    if not text:
        return [] if not collapse else ""
    if collapse:
        return " ".join(text.split())
    entries: List[str] = []
    current_parts: List[str] = []
    bullet_mode = False
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("•"):
            bullet_mode = True
            if current_parts:
                entries.append(" ".join(current_parts).strip())
                current_parts = []
            line = line[1:].strip()
            current_parts.append(line)
        else:
            current_parts.append(line)
    if current_parts:
        entries.append(" ".join(current_parts).strip())
    if not bullet_mode and entries:
        return [" ".join(entries)]
    return [entry for entry in entries if entry]


def normalize_heading(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().upper())


def get_blocks(page: fitz.Page) -> List[Dict]:
    raw_blocks = sorted(page.get_text("blocks"), key=lambda b: (round(b[1], 1), round(b[0], 1)))
    blocks = []
    for block in raw_blocks:
        x0, y0, _, _, text, *_ = block
        cleaned = text.strip()
        if not cleaned:
            continue
        blocks.append(
            {
                "text": cleaned,
                "x0": x0,
                "y0": y0,
            }
        )
    return blocks


def detect_category(blocks: List[Dict]) -> Optional[Dict[str, str]]:
    full_text = " ".join(block["text"] for block in blocks).upper()
    for header, meta in CATEGORY_HEADERS.items():
        if header in full_text:
            return meta
    return None


def extract_title_from_blocks(blocks: List[Dict]) -> Optional[str]:
    skip_tokens = {
        "SITUATION GLOBALE",
        "> RETOUR AU SOMMAIRE",
        "OBJECTIF DE LA SITUATION",
        "BUT DE LA SITUATION",
        "CONSIGNES",
        "VARIANTES",
        "DIMENSION TECHNICO-TACTIQUE",
        "CRITÈRES DE RÉUSSITE",
    }
    for block in blocks:
        text = block["text"].strip()
        first_line = text.splitlines()[0].strip()
        upper = first_line.upper()
        if not first_line or first_line.isdigit():
            continue
        if upper in skip_tokens:
            continue
        if upper.startswith("CRITÈRES") or upper.startswith("METTRE ") or upper.startswith("ROMPRE ") or upper.startswith("EXPLOITER "):
            continue
        return first_line
    return None


def locate_headings(blocks: List[Dict]) -> Tuple[Dict[str, Tuple[int, float]], Dict[int, int]]:
    positions: Dict[str, Tuple[int, float]] = {}
    index_by_position: Dict[int, List[str]] = {}
    for idx, block in enumerate(blocks):
        norm = normalize_heading(block["text"])
        matched = False
        for label, key in HEADING_TITLES.items():
            if label in norm:
                positions[key] = (idx, block["x0"])
                index_by_position.setdefault(idx, []).append(key)
                matched = True
                break
        if matched:
            continue
        if "CRITÈRES DE RÉUSSITE" in norm:
            positions["success"] = (idx, block["x0"])
            positions["execution"] = (idx, block["x0"])
            index_by_position.setdefault(idx, []).extend(["success", "execution"])
    unique_positions = sorted(index_by_position.keys())
    next_lookup: Dict[int, int] = {}
    for i, position in enumerate(unique_positions):
        next_idx = unique_positions[i + 1] if i + 1 < len(unique_positions) else len(blocks)
        next_lookup[position] = next_idx
    return positions, next_lookup


def gather_section(
    name: str,
    blocks: List[Dict],
    positions: Dict[str, Tuple[int, float]],
    next_lookup: Dict[int, int],
    *,
    collapse: bool = False,
    column_filter: Optional[str] = None,
) -> List[str] | str:
    if name not in positions:
        return [] if not collapse else ""
    start_idx, ref_x = positions[name]
    end_idx = next_lookup.get(start_idx, len(blocks))
    ref_x_value = ref_x
    if name not in {"success", "execution"} and ref_x_value < 200:
        for block in blocks[start_idx + 1 : end_idx]:
            upper = block["text"].strip().upper()
            if upper in SECTION_SKIP:
                continue
            if block["x0"] > ref_x_value + 150:
                ref_x_value = block["x0"]
                break

    def default_filter(block: Dict) -> bool:
        return (ref_x_value - 40) <= block["x0"] <= (ref_x_value + 420)

    def success_filter(block: Dict) -> bool:
        return block["x0"] < ref_x + 120

    def execution_filter(block: Dict) -> bool:
        return ref_x + 120 <= block["x0"] <= ref_x + 450

    filter_func = default_filter
    if column_filter == "success":
        filter_func = success_filter
    elif column_filter == "execution":
        filter_func = execution_filter

    collected: List[str] = []
    for block in blocks[start_idx + 1 : end_idx]:
        if not filter_func(block):
            continue
        upper = block["text"].strip().upper()
        if upper in SECTION_SKIP:
            continue
        collected.append(block["text"])
    combined = "\n".join(collected).strip()
    return clean_section(combined, collapse=collapse)


def extract_image(page: fitz.Page, image_dir: Path, slug: str) -> Optional[str]:
    images = page.get_images(full=True)
    if not images:
        return render_full_page(page, image_dir, slug)
    best_info: Optional[Tuple[int, Tuple]] = None
    for img in images:
        xref = img[0]
        width, height = img[2], img[3]
        area = width * height
        if area < 40_000:  # filter out tiny icons
            continue
        if best_info is None or area > best_info[0]:
            best_info = (area, img)
    if best_info is None:
        return None
    _, best_img = best_info
    xref = best_img[0]
    pix = fitz.Pixmap(page.parent, xref)
    if pix.n > 4:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    filename = f"{page.number + 1:02d}-{slug}.png"
    output_path = image_dir / filename
    pix.save(output_path)
    return f"/images/{filename}"


def render_full_page(page: fitz.Page, image_dir: Path, slug: str) -> str:
    matrix = fitz.Matrix(1.5, 1.5)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    filename = f"{page.number + 1:02d}-{slug}-page.png"
    pix.save(image_dir / filename)
    return f"/images/{filename}"


def wipe_directory(directory: Path) -> None:
    if not directory.exists():
        directory.mkdir(parents=True, exist_ok=True)
        return
    for item in directory.iterdir():
        if item.is_file():
            item.unlink()
        elif item.is_dir():
            shutil.rmtree(item)


def build_dataset(pdf_path: Path, output_js: Path, image_dir: Path) -> None:
    doc = fitz.open(pdf_path)
    wipe_directory(image_dir)

    exercises = []
    for page in doc:
        blocks = get_blocks(page)
        category = detect_category(blocks)
        if not category:
            continue
        title = extract_title_from_blocks(blocks)
        if not title:
            continue
        if "Objectif de la situation" not in " ".join(block["text"] for block in blocks):
            continue
        slug = slugify(title)
        positions, next_lookup = locate_headings(blocks)

        objective = gather_section("objective", blocks, positions, next_lookup, collapse=True)
        goal = gather_section("goal", blocks, positions, next_lookup, collapse=True)
        instructions = gather_section("instructions", blocks, positions, next_lookup)
        variants = gather_section("variants", blocks, positions, next_lookup)
        success = gather_section("success", blocks, positions, next_lookup, column_filter="success")
        execution = gather_section("execution", blocks, positions, next_lookup, column_filter="execution")

        exercise = {
            "title": title,
            "slug": slug,
            "categoryId": category["id"],
            "objective": objective,
            "goal": goal,
            "instructions": instructions,
            "variants": variants,
            "successCriteria": success,
            "executionTips": execution,
            "page": page.number + 1,
            "image": extract_image(page, image_dir, slug),
        }
        exercises.append(exercise)

    grouped: Dict[str, Dict] = {meta["id"]: {**meta, "exercises": []} for meta in CATEGORY_HEADERS.values()}
    for ex in sorted(exercises, key=lambda item: item["page"]):
        grouped[ex["categoryId"]]["exercises"].append(ex)

    ordered_categories = [grouped[meta["id"]] for meta in CATEGORY_HEADERS.values()]

    output_js.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": Path(pdf_path).name,
        "categories": ordered_categories,
    }
    with output_js.open("w", encoding="utf-8") as f:
        f.write("// This file is auto-generated by scripts/extract_pdf.py\n")
        f.write("// Do not edit manually.\n\n")
        f.write("export const problematics = ")
        f.write(json.dumps(payload["categories"], ensure_ascii=False, indent=2))
        f.write(";\n")
        f.write("\nexport const exercisesBySlug = new Map(problematics.flatMap(cat => cat.exercises.map(ex => [ex.slug, ex])));\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract structured data from the EPS badminton PDF.")
    parser.add_argument("--pdf", type=Path, required=True, help="Path to the Livret PDF")
    parser.add_argument("--output", type=Path, required=True, help="Destination JS data file")
    parser.add_argument("--images", type=Path, required=True, help="Directory to store extracted images")
    args = parser.parse_args()
    build_dataset(args.pdf, args.output, args.images)
