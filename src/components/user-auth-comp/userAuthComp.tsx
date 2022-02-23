import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';

import RegisterComp from './register-comp/registerComp';
import LoginComp from './login-comp/loginComp';
// type UserCompProps = { match: { params: { id: string }, url: string, path: string } };
import './userAuthStyle.scss';

@observer
class UserAuthComp extends PureComponent {
  render() {
    return (
    <div className="authContainer">
      <RegisterComp />
      <LoginComp />
    </div>
  );}
}

export default UserAuthComp;
