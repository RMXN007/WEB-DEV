import { useState } from 'react'
import './App.css'


function App() {
  const [color, setColor] = useState("pink");

  return (
    <div className="body" style={{backgroundColor:color}}>
      <div className="nav">
        <div className="box">
          <button 
          onClick={()=>setColor("red")}
          className="btn btn1">
            Red
          </button>
          <button 
          onClick={()=>setColor("green")}
          className="btn btn2">
            Green
          </button>
          <button 
          onClick={()=>setColor("blue")}
          className="btn btn3">
            Blue
          </button>
          <button 
          onClick={()=>setColor("yellow")}
          className="btn btn4">
            Yellow
          </button>
          <button 
          onClick={()=>setColor("olive")}
          className="btn btn5">
            Olive
          </button>
          <button 
          onClick={()=>setColor("pink")}
          className="btn btn6">
            Pink
          </button>
          <button 
          onClick={()=>setColor("orange")}
          className="btn btn7" >
            Orange
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
