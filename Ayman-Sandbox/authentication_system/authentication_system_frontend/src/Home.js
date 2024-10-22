import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  
  // The use effect hook sets the state of loggedIn 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    var responseStatus;
    fetch('http://localhost:8081/name', {
      headers: {'token': token},       // Content-Type is in quotes because it has a '-'
    })
    .then(response => {
      responseStatus = response.status;
      return response.json();
    })
    .then(responseContent => {
      if (responseStatus === 200) {
        setLoggedIn(true);
        setName(responseContent);
        console.log(responseContent);
      } 
    })
    .catch(err => console.log(err));
  }, []);
  
  const handleLogout = () => {
    if (!loggedIn) {
      alert('You are alredy logged out!');
    }
    else {
      localStorage.removeItem('token');
      window.location.reload(true);   // Refreshes the current page, same as clicking the refresh button in your browser
    }
  }

  return (
    <div>
      {
        loggedIn ? 
        <div>
          <h3>You are authorized</h3>
          <h3>Your name is: {name}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
        :
        <div>
          <h3>Login Now</h3>
          <Link to="/login">Login</Link>
        </div>
      }
      Home
    </div>
  );
}

export default Home;