import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ProblemList from './pages/ProblemList.jsx'
import ProblemDetail from './pages/ProblemDetail.jsx'
import ExerciseDetail from './pages/ExerciseDetail.jsx'
import BasesTechniques from './pages/BasesTechniques.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/problemes" element={<ProblemList />} />
          <Route path="/problemes/:slug" element={<ProblemDetail />} />
          <Route path="/exercices/:slug" element={<ExerciseDetail />} />
          <Route path="/bases-techniques" element={<BasesTechniques />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
