import { Link } from "react-router-dom";
import "./styles.css";
import { apiCall } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({result: resultState,setResult}) {
const [responseMessage, setResponseMessage] = useState("");
const navigate = useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await apiCall({
        method: "POST",
        uri: "auth/login", 
        body:{
        
        email: resultState.email,
        password: resultState.password},
        isJwt: false,
    });
    console.log(result)
    if (result?.data?.token){
    localStorage.setItem("resume_server_jwt_token",result?.data?.token)
    setTimeout(() => {
      navigate("/");}
      ,1000)
    }
    setResponseMessage(result?.data?.token)

    }catch(err){
    setResponseMessage(err?.response?.data?.status || err.message)
    }
  
  };

 

  return (
    
    <div className="App">
      {
            responseMessage && <div>{responseMessage}</div>
        }
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form__container">
        <div className="form__controls">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={resultState.email}
            onChange={(e) =>setResult((draft)=>{
                draft.email = e.target.value
            })}
          />
        </div>
        <div className="form__controls">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={resultState.password}
            onChange={(e) =>setResult((draft)=>{
                draft.password = e.target.value 
            })}
          />
        </div>
        <div className="form__controls">
          <button className="button">Login</button>
        </div>
        <Link to="/SignUp">SignUp</Link>
      </form>
    </div>
  );
}
