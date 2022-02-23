import React, {PureComponent} from 'react';
// import { appRootModel } from '../../../modelsContext';
import { observable } from 'mobx'
import { observer } from 'mobx-react';
// import { User } from '../../../models/userModel';
// import jwt from 'jsonwebtoken';
// import objectID from 'bson-object';
// import { IReactionDisposer, autorun, observable } from 'mobx';

// does "UserCompProps" is needed?...
// type UserCompProps = { match: { params: { id: string }, url: string, path: string } };
// type IUserProps = { name: string; email: string; password: string; };

@observer
class RegisterComp extends PureComponent {
    // class RegisterComp extends PureComponent<UserCompProps> {

  // @observable user?: User;
  @observable name: string = "";
  @observable email : string = "";
  @observable password: string = "";
  

  onRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const response = await fetch('http://localhost:3000/api/userAuth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.name,
        email: this.email,
        password: this.password
      })
    });

    const jsonData = await response.json();

    if(jsonData.status === 'ok') {
      localStorage.clear();
			alert('YAY Successful Registration!')
			this.name = "";
      this.email = "";
      this.password = "";
      console.log("json test data when status 'ok' is: ",jsonData.test);
    }
  }

    render() {
        

        return (
        <div style={{border: 'solid blue 0.2em', padding: '2%', borderEndStartRadius: '12px', borderStartStartRadius: '12px', height: '29.8vh' }}>
          <h1>Register</h1>
        	<form onSubmit={(e) => {this.onRegisterUser(e)}}>
        	  <input 
        	     value={this.name} 
        	     onChange={(e) => this.name = e.target.value}
							 autoComplete="off"
        	     type="text" 
        	     placeholder="Name"/>
        	  <br/>
        	  <input 
        	      value={this.email} 
        	      onChange={(e) => this.email = e.target.value}
        	      type="email"
								autoComplete="new-password" 
        	      placeholder="Email"/>
        	  <br/>
        	  <input
        	      value={this.password}
        	      onChange={(e) => this.password = e.target.value} 
        	      type="password" 
        	      placeholder="Password"/>
        	  <br/>
        	  <input type="submit" value="Register"/>
        	</form>
        </div>
        )
    }
}

 export default RegisterComp;



    // if (this.user) {
    //   // this.user = new User(AppRootModel.userModel, { _id: newId, name: 'New Dish', mealId: this.meal._id });
    //   // AppRootModel.userModel.createItem(newUser);
    // } else {
    //   let newId: string = (new ObjectID()).toHexString()
    //   // let newUser = new User(AppRootModel.userModel, { _id: newId, name: this.name, email: this.email, password: this.password });
    //   //   newUser.store.createItem(newUser);
    // }

  // populateUser = async() => {
  //   const req = await fetch('http://localhst:3000/api/userAuth', {
  //      method: 'GET',
	// 		headers: {
	// 			'x-access-token': localStorage.getItem('token'),
	// 		},
	// 	})

  //   const data = await req.json();
  //   if(data.status === 'ok') {

  //   } else {

  //   }
  //   console.log('hello: ', data);
  // }

 
    // if(token){
    //   const user = jwt.decode(token);
    //   if(!user) {
    //     console.log('user does not exist');
    //     localStorage.removeItem('token');
    //   } else {
    //     this.populateUser();
    //   }
    // }
  

  // constructor(props: UserCompProps) {
    
    // super(props);
  //   // why use derivation of autorun and not computed?..
  //   // autorun - Runs the reaction immediately 
  //   // and also on any change 
  //   // in the observables used inside function !
      // this.disposeAutorun = autorun(async () => {
    //     const req = await fetch('http://localhost:3000/api/userAuth', {
    //   method: 'GET',
    //   headers: {
    //     'x-access-token': localStorage.getItem('token'),
    //   },
    // });

    // const data = await req.json();
    // (data.status === 'ok') ? this.name = req.;
    
          // let userId: string = this.props.match.params.id;
          // this.user = AppRootModel.userModel.items.find((u: User) => u._id === userId);
  //         // let mealIngs: Ingredient[] = [];
  //         if (this.user) {
  //             // mealIngs = Array.prototype.concat.apply([], this.meal.dishes.map(d => d.ingredients.map(ing => ing)));
  //             // this.mealQuantity = mealIngs.reduce((mealCost: number, ing) => { return mealCost + ((ing.getItemBaseUnit === 'Kg') ? ing.convertedQuantity : 0) }, 0);
  //             // this.mealExpenses = AppRootModel.ingredientModel.items.reduce((mealCost: number, ing) => { return mealCost + ing.cost }, 0);
  //             // this.preparing = (this.meal as Meal).preparing;
  //             // this.serving = (this.meal as Meal).serving;
          // }
      // });
  // }
 
//   componentWillUnmount() {
//     this.disposeAutorun();
// }