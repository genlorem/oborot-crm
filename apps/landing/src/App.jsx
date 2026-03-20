import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './landing/Landing'
import Form from './form/pages/Form'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  )
}
