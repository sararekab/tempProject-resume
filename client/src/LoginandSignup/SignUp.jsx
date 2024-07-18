import "./styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiCall } from "../services/api";


export default function SignUp({result: resultState,setResult}) {
   
 
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
      try{
          const result = await apiCall({
            method: "POST",
            uri: "auth/create", 
            body:{
            name,
            email: resultState.email,
            password: resultState.password},
            isJwt: false,
        });

        if(result?.data?._id){
          setResponseMessage(`User ${result?.data?._id} created successfully.you will be redirected to login page in 5 seconds`)
        }
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }catch(err){
        setResponseMessage(err?.response?.data?.status || err.message)
        }
      
      };
  
  return (
    <div className="App">
        {
            responseMessage && <div>{responseMessage}</div>
        }
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit} className="form__container">
        <div className="form__controls">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </div>
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
            onChange={(e) => setResult((draft)=>{
                draft.password = e.target.value
            })}
          />
        </div>
        <div className="form__controls">
          <button className="button">SignUp</button>
        </div>
        <Link to="/login">Login</Link>  
      </form>
    </div>
  );
}
