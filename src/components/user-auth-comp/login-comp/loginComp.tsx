import React from 'react';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const LoginComp = () => {
    // const navigate = useNavigate();
      const [email, setEmail] = useState('');  
      const [password, setPassword] = useState('');  
    
     const onUserLogin = async(e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       console.log('user login');
       const reqBody = JSON.stringify({
        email,
        password
      })
        // this API passes the body as Json object to the server 
        const response = await fetch('http://localhost:9000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: reqBody 
        });
    
        const jsonData = await response.json();
    
        if(jsonData.user) {
          localStorage.setItem('token', jsonData.user);
          // alert('Login successful!');
          // navigate('/dashboard', { replace: true });
          window.location.href = '/dashboard';
        } else {
          alert('Please check your username and password!');
        }
    
        console.log(jsonData);
      }
    
      return (
        <div>
          <h1>Login</h1>
          <form onSubmit={(e) => onUserLogin(e)}>
            <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                placeholder="Email"/>
            <br/>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="Password"/>
            <br/>
            <input type="submit" value="Login"/>
          </form>
        </div>
      );
}

    
export default LoginComp;