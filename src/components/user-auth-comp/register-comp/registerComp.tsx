import React, { PureComponent } from "react";
// import { appRootModel } from '../../../modelsContext';
import { observable } from "mobx";
import { observer } from "mobx-react";
import ObjectID from "bson-objectid";
import { AppRootModelsContext } from "../../../App";
import { User } from "../../../models/userModel";
// import jwt from 'jsonwebtoken';
// import objectID from 'bson-object';
// import { IReactionDisposer, autorun, observable } from 'mobx';

/*  Does "UserCompProps" is needed?...
// type UserCompProps = { match: { params: { id: string }, url: string, path: string } };
type IUserProps = { name: string; email: string; password: string; };    */

@observer
class RegisterComp extends PureComponent {
  // class RegisterComp extends PureComponent<UserCompProps> {

  // @observable user?: User;
  // @observable camp: string = "";
  @observable fullName: string = "";
  @observable email: string = "";
  @observable password: string = "";

  onRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // camp: this.camp,
        name: this.fullName,
        email: this.email,
        password: this.password,
      }),
    });

    const jsonData = await response.json();

    if (jsonData.status === "ok") {
      let newId = new ObjectID().toHexString();
      let newUser = new User(AppRootModelsContext.userModel, {
        _id: newId,
        fullName: this.fullName,
        email: this.email,
        password: this.password,
      });
      newUser.store.createObject(newUser);

      localStorage.clear();
      this.fullName = "";
      this.email = "";
      this.password = "";
      // this.camp = "";
      alert("YAY Registration Successfully Done!");
    } else {
      alert(jsonData.error);
    }
  };

  render() {
    return (
      <div
        style={{
          border: "solid blue 0.2em",
          padding: "2%",
          borderEndStartRadius: "12px",
          borderStartStartRadius: "12px",
          height: "29.8vh",
        }}
      >
        <h1>Register</h1>
        <form
          onSubmit={(e) => {
            this.onRegisterUser(e);
          }}
        >
          {/* <input 
        	     value={this.camp} 
        	     onChange={(e) => this.camp = e.target.value}
							 autoComplete="off"
        	     type="text" 
        	     placeholder="Name"/>
        	  <br/> */}
          <input
            value={this.fullName}
            onChange={(e) => (this.fullName = e.target.value)}
            autoComplete="off"
            type="text"
            placeholder="Name"
          />
          <br />
          <input
            value={this.email}
            onChange={(e) => (this.email = e.target.value)}
            type="email"
            autoComplete="new-password"
            placeholder="Email"
          />
          <br />
          <input
            value={this.password}
            onChange={(e) => (this.password = e.target.value)}
            type="password"
            placeholder="Password"
          />
          <br />
          <input type="submit" value="Register" />
        </form>
      </div>
    );
  }
}

export default RegisterComp;
