import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [counter, setCounter] = useState(15)

  const AddCounter = () => {
    if(counter>=20){
      console.log("Sorry but counter reached 20");
    }else{
      setCounter(counter + 1)
    }
    console.log(counter)
  }

  const RemoveCounter = () => {
    if(counter<=0){
      console.log("Sorry but counter reached 0");
    }else{
      setCounter(counter - 1)
    }
  }
  return (
    <>
      <img src={viteLogo} alt="" />
      <img src={reactLogo} alt="" />
      <h1>Chai Counter</h1>
      <h3>Counter Number :{counter}</h3>
      <br />
      <button
      onClick={AddCounter}>Counter plus</button>
      <button
      onClick={RemoveCounter}>Counter minus</button>
    </>
  )
}

export default App
