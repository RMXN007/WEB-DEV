import './App.css'
import Login from './Components/Login.jsx'
import Profile from './Components/Profile.jsx';
import UserContextProvider from './Contexts/UserContextProvider';
import UserContext from './Contexts/UserContext';

function App() {

  return (
    <UserContextProvider>
      <h1 className="bg-blue-200 text-3xl font-bold underline">
        Hello world!
      </h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App
