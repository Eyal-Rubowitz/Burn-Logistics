import React, { PureComponent } from 'react';
import jwt from 'jsonwebtoken';

import RegisterComp from './register-comp/registerComp';
import LoginComp from './login-comp/loginComp';

class userAuthComp extends PureComponent {
  
    t = jwt;

    render() {
        return (
            <div style={{display: 'block', width: '50%', border: '2px solid blue', position: 'absolute', height: '80%', left: '25%'}}>
                <h1 style={{display: 'block', left: '0%', textAlign: 'center'}}>Welcome to Burn-Logistics!</h1>
                <div style={{display: 'flex', flexWrap: 'wrap', flex: '1 1 0', alignSelf: 'center', justifyContent: 'center', alignItems: 'flexStart'}}>
                    <div style={{border: 'red 1px solid', width: '45%',textAlign: 'center', height: '50vh'}}>
                        <RegisterComp/>
                    </div>
                    <div style={{border: 'red 1px solid', width: '45%', textAlign: 'center'}}>
                        <LoginComp/>
                    </div>
                </div>
            </div>
        );
    }
}

export default userAuthComp;