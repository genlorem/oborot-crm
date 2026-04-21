import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './landing/Landing'
import Form from './form/pages/Form'
import Roadmap from './roadmap/Roadmap'
import InternalRoadmap from './roadmap/InternalRoadmap'
import Marketplace from './segments/Marketplace'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<Form />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/internal" element={<InternalRoadmap />} />
        <Route path="/for/marketplace" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  )
}
