import React, { useEffect }  from "react";
import { useImmer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCV from "./components/CreateCV";
import Resume from "./components/Resume";
import Home from "./components/Home"; 
import Login from "./LoginandSignup/login";
import SignUp from "./LoginandSignup/SignUp";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { apiCall } from "./services/api";

const App = () => {
  //👇🏻 state holding the result
  const [result, setResult] = useImmer({
    
    email: "", 
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('resume_server_jwt_token');
    if ( window.location.pathname != '/login') {
      if (!token) {
      location.href = '/login';
      return "";
  }
  if(window.location.pathname != '/login'){
    (async () => {
      try{
        const result = await apiCall({
          method: "POST",
          uri: "auth/validate",
          body: {},
          isJwt: true,
        });
  
        if(!result?.data?.isValidate) {
          location.href = '/login';
          return "";
        }
      }catch(err){
        location.href = '/login';
          return "";
      }
      
    })();

  }}
    
  },[]);


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateCV result={result} setResult={setResult} />} />
          <Route path="/login" element={<Login result={result} setResult={setResult} />} />
          <Route path="/SignUp" element={<SignUp result={result} setResult={setResult}/>} />
           <Route path="/resume" element={<Resume result={result} setResult={setResult} />} />
          <Route path="/resumeFr" element={<Resume result={result} setResult={setResult} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
