import React ,{ useState ,useContext} from "react";
import UserContext from "../Contexts/UserContext";

function Login() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const {setUser} = useContext(UserContext);

    const HandleSubmit = (e) => {
        e.preventDefault();
        setUser({username,password})
    }

    return(
        <div>
            <h1>Login to Chai</h1>
            <span className="bg-red-500" >Username : </span>
            <input 
            type="text" 
            placeholder="username"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
            />
            <input className="bg-red-500"
            type="text" 
            placeholder="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            />
            <br />
            <button onClick={HandleSubmit}>Submit</button>
        </div>    
    )
}
export default Login;