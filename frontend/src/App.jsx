import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuBar from './components/MenuBar'
import GetStart from './pages/GetStart'
import Editing from './pages/Editing'
import Render from './pages/Render'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <MenuBar />
        <Routes>
          <Route path="/" element={<GetStart />} />
          <Route path="/editing" element={<Editing />} />
          <Route path="/editing/:projectId" element={<Editing />} />
          <Route path="/render" element={<Render />} />
          <Route path="/render/:projectId" element={<Render />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App