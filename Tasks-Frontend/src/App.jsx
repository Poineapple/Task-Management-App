import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tasks from './components/Tasks'
import './styling.css'
import MouseListener from './components/MouseListener';

function App() {

  return (
    <div className='bg-grad-anim md:p-10'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
