import { useState } from 'react'
import { useParticel } from './hooks/useParticel'

function App() {
  useParticel()
  return (
    <>
      {/* <div className='h-screen flex'>
        <h1 className="z-20 text-3xl font-bold underline text-white">
          Particelle pazzesche
        </h1>
      </div> */}
      <canvas className='webgl absolute top-0 z-10'></canvas>
    </>
  )
}

export default App
