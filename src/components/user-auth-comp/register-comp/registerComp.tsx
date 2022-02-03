import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';

const RegisterComp = () => {
//   const navigate = useHistory();
  const [name, setName] = useState('');  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  

 const onRegisterUser = async(e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
      // try{
      //   const body = JSON.stringify({name, email, password});
      //   const response = await axios.post('http://localhost:1337/api/register', body);
        
      //   console.log('data: ', response.data);
      // } catch(err) {
      //   console.log("err: ", err);
      // }
      // console.log('user register');


    // // this API passes the body as Json object to the server 
    const response = await fetch('http://localhost:9000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const jsonData = await response.json();

    if(jsonData.status === 'ok') {
        setName('');
        setEmail('');
        setPassword('');
    //   navigate("/login", { replace: true })
        // navigate.push("/login");
    } else {
        alert('OOPS pleas fill up all of the fields!')
    }
    console.log(jsonData);
  }

  return (
    <div style={{alignSelf: 'center'}}>
      <h1>Register Comp</h1>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => onRegisterUser(e)}>
        <input 
           value={name} 
           onChange={(e) => setName(e.target.value)}
           type="text" 
           placeholder="Name"/>
        <br/>
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
        <input type="submit" value="Register"/>
      </form>
    </div>
  );
}

export default RegisterComp;