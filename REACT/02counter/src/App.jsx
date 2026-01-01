import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [counter,setCounter] =useState(15)

  const AddCounter=() =>{
    setCounter(counter+1)
    console.log(counter)
  }
  
  const RemoveCounter=() =>{
    setCounter(counter-1)

  }
  return (
    <>
      <h1>Chai Counter</h1>
      <h3>Counter Number :15</h3>
      <br />
      <button
      onClick={AddCounter}>Counter plus</button>
      <button
      onClick={RemoveCounter}>Counter minus</button>
    </>
  )
}

export default App
