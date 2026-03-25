import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider } from './Contexts/ThemeContext'
import Card from './Components/Card'
import ThemeBtn from './Components/ThemeBtn'

function App() {
  const [themeMode, setThemeMode] = useState("light")

  const darkTheme = () =>{
    setThemeMode("dark")
  }
  const lightTheme = () =>{
    setThemeMode("light")
  }

  useEffect(()=>{
    if(themeMode === "dark"){
      document.documentElement.classList.add("dark")
    }else{
      document.documentElement.classList.remove("dark")
    }
  },[themeMode])

  return (
    <ThemeProvider value={{themeMode,darkTheme,lightTheme}}>
        <div className="text-amber-100 dark:text-amber-500">
          Theme Switcher
        </div>
        <div className="flex flex-wrap min-h-screen items-center">
          <div className="w-full">
              <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
                  <ThemeBtn />
              </div>

              <div className="w-full max-w-sm mx-auto">
                  <Card />
              </div>
          </div>
      </div>
    </ThemeProvider>
  )
}

export default App
