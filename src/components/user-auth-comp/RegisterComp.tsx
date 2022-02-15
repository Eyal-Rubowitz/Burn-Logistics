import React, { PureComponent, Fragment } from 'react';
import { AppRootModel } from '../../modelsContext';
import { IReactionDisposer, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import { User } from '../../models/userModel';
import ObjectID from 'bson-objectid';

// import ObjectID from 'bson-objectid';

// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

type UserCompProps = { match: { params: { id: string }, url: string, path: string } };

@observer
class RegisterComp extends PureComponent<UserCompProps> {
  // disposeAutorun: IReactionDisposer;
  @observable user?: User;
  @observable name: string = "";
  @observable email : string = "";
  @observable password: string = "";
 
  // constructor(props: UserCompProps) {
    
  //   super(props);
  //   // why use derivation of autorun and not computed?..
  //   // autorun - Runs the reaction immediately 
  //   // and also on any change 
  //   // in the observables used inside function !
  //     this.disposeAutorun = autorun(() => {
  //         let userId: string = this.props.match.params.id;
  //         this.user = AppRootModel.userModel.items.find((u: User) => u._id === userId);
  //         // let mealIngs: Ingredient[] = [];
  //         if (this.user) {
  //             // mealIngs = Array.prototype.concat.apply([], this.meal.dishes.map(d => d.ingredients.map(ing => ing)));
  //             // this.mealQuantity = mealIngs.reduce((mealCost: number, ing) => { return mealCost + ((ing.getItemBaseUnit === 'Kg') ? ing.convertedQuantity : 0) }, 0);
  //             // this.mealExpenses = AppRootModel.ingredientModel.items.reduce((mealCost: number, ing) => { return mealCost + ing.cost }, 0);
  //             // this.preparing = (this.meal as Meal).preparing;
  //             // this.serving = (this.meal as Meal).serving;
  //         }
  //     });
  // }
 
//   componentWillUnmount() {
//     this.disposeAutorun();
// }

  onRegisterUser(): void {
    if (this.user) {
      // this.user = new User(AppRootModel.userModel, { _id: newId, name: 'New Dish', mealId: this.meal._id });
      // AppRootModel.userModel.createItem(newUser);
    } else {
      let newId: string = (new ObjectID()).toHexString()
      // let newUser = new User(AppRootModel.userModel, { _id: newId, name: this.name, email: this.email, password: this.password });
      //   newUser.store.createItem(newUser);
    }
  }

  render() {
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={() => {this.onRegisterUser()}}>
        <input 
           value={this.name} 
           onChange={(e) => this.name = e.target.value}
           type="text" 
           placeholder="Name"/>
        <br/>
        <input 
            value={this.email} 
            onChange={(e) => this.email = e.target.value}
            type="email" 
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
  );}
}

export default RegisterComp;
