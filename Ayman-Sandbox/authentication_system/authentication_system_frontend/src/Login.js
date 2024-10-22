import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const navigate = useNavigate();

  const onEmailChange = (event) => {
    setSignInEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setSignInPassword(event.target.value);
  };

  const handleLogin = () => {
    var responseStatus;
    fetch('http://localhost:8081/login', {
      method: 'post',
      body: JSON.stringify({email: signInEmail, password: signInPassword}), 
      headers: {'Content-Type': 'application/json'},       // Content-Type is in quotes because it has a '-'
    })
    .then(response => {
      responseStatus = response.status;
      return response.json();
    })
    .then(responsePayload => {
      if (responseStatus === 200) {
        // Store the token in a cookie/local storage 
        localStorage.setItem('token', responsePayload.token);
        alert('Login success!');
        navigate('/');
      } 
      else {
        alert(responsePayload);
      }
    })
    .catch(err => console.log(err));
  }


  return (
    <div>
      <label>Email:</label>
      <input type="email" name="email" required onChange={onEmailChange}/><br />
      <label>Password:</label>
      <input type="password" name="password" minLength="5" onChange={onPasswordChange}/><br />
      <button type="submit" value="Submit" onClick={handleLogin}>Submit</button>
    </div>
  );
}

export default Login;