import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
// import { IReactionDisposer, autorun, observable } from 'mobx';
import jwt from 'jsonwebtoken';
// import { globalAgent } from 'http';

type IUserProps = { name: string; email: string; password: string; };
// type UserCompProps = { match: { params: { id: string }, url: string, path: string } };

@observer
class LoginComp extends PureComponent {
  // disposeAutorun: IReactionDisposer;
  
  @observable token = localStorage.getItem('token') || "";
  @observable jsonUserToken = jwt.decode(this.token, { json: true }) as IUserProps;
  
  @observable email: string = (this.jsonUserToken) ? this.jsonUserToken.email : "";
  @observable password: string = "";    

    onUserLogin = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const reqBody = JSON.stringify({
        email: this.email,
        password: this.password
     })
       // this API passes the body as Json format to the server 
       const response = await fetch('http://localhost:3000/api/users/login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: reqBody 
       });
   
       const jsonData = await response.json();
   
       if(jsonData.userToken) {
         localStorage.setItem('token', jsonData.userToken);
         window.location.href = 'http://localhost:3000/schedule';
       } else {
         alert('Please check your username and password!');
       }
   
       console.log(jsonData);
     }


  render() {

  return (
    <div style={{border: 'solid blue 0.2em', padding: '2%', borderStartEndRadius: '12px', borderEndEndRadius: '12px', height: '29.8vh' }}>
      <h1>Login</h1>
      <form onSubmit={(e) => this.onUserLogin(e)} >
        <input 
            value={this.email} 
            onChange={(e) => this.email = e.target.value}
            type="email" 
            autoComplete="email"
            placeholder="Email"/>
        <br/>
        <input
            value={this.password}
            onChange={(e) => this.password = e.target.value} 
            type="password"
            autoComplete="current-password" 
            placeholder="Password"/>
        <br/>
        <input type="submit" value="Login" style={{position: 'relative', top: '2.8vh'}} />
      </form>
    </div>
  );
}

}

export default LoginComp;
