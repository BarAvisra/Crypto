import React from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Show from './pages/Show.jsx'
import homeStore from './stores/homeStore.js'

function App() {

  useEffect(() => {

  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/:id' element={<Show />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
