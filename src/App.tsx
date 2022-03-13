import {
  AppBar, Typography, Container, Toolbar,
  createTheme, responsiveFontSizes, MuiThemeProvider
} from '@material-ui/core';

import React from 'react';
// import React, { useEffect } from 'react';
  
// react-router-dom is made for "Web application", and react-router-native 
// is made for "react native mobile apps" both uses react-router at core!
import { BrowserRouter as Router, NavLink, Switch, Route } from 'react-router-dom';

// import jwt from 'jsonwebtoken';

import { AppRootModel } from './modelsContext';
// import UserAuthComp from "./components/user-auth-comp/userAuthComp";

import MealComp from "./components/meals-comp/mealComp";
import MealListComp from './components/meals-comp/mealListComp';
import ScheduleTableComp from './components/schedule-comp/scheduleComp';
import FoodItemListComp from './components/foodItems-comp/foodItemListComp';
import InventoryListComp from './components/inventory-comp/inventoryComp';
import BuyingListComp from './components/buying-comp/buyingListComp';
import BossSettingsComp from './components/boss-settings-comp/bossSettingsComp';
import IngredientNoteComp from './components/dishes-comp/ingredient-note-comp/ingredientNoteComp';
import KitchenToolsFunc from './components/kitchen-tools-comp/kitchenToolsComp';
// import RegisterComp from './components/user-auth-comp/RegisterComp';
import UserAuthComp from './components/user-auth-comp/userAuthComp';

import ChefMeal from './assets/chefMeal.png';
import Calender from './assets/calendar.png';
import Ingredients from './assets/ingredients.png';
import InvBox from './assets/invBox.png';
import BuyingList from './assets/buyingList.png';
import AdminSettings from './assets/adminSettings.png';
import KitchenTools from './assets/kitchenTools.png';
import LogOut from './assets/Logout.png';
import './AppStyle/style.scss';

const wsEndpoint = process.env.wsEndpoint || "localhost:9000/ws";

const ws = new WebSocket(`ws://${wsEndpoint}`);
ws.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  console.log('ws data: ', data);
  switch (data.type) {
    case "users": {
      console.log("register case");
      AppRootModel.userModel.updateObjFromServer(data.obj);
      break;
    }
    // case "login": {
    //   console.log("login case");
    //   AppRootModel.userModel.updateItemFromServer(data.item);
    //   break;
    // }
    case "meal": {
      console.log('meal case');
      AppRootModel.mealModel.updateObjFromServer(data.item);
      break;
    }
    case "dish": {
      console.log('dish case');
      AppRootModel.dishModel.updateObjFromServer(data.item);
      break;
    }
    case "ingredient": {
      console.log('ingredient case');
      AppRootModel.ingredientModel.updateObjFromServer(data.item);
      break;
    }
    case "foodItem": {
      console.log('foodItem case');
      AppRootModel.foodItemModel.updateObjFromServer(data.item);
      break;
    }
    case "inventory": {
      console.log('inventory case');
      AppRootModel.inventoryModel.updateObjFromServer(data.item);
      break;
    }
    case "allergens": {
      console.log('allergens case');
      AppRootModel.allergensModel.updateObjFromServer(data.item);
      break;
    }
    case "kitchenTools": {
      console.log('Kitchen tools case');
      AppRootModel.kitchenToolsModel.updateObjFromServer(data.item);
      console.log('ws: ', data.item);
      break;
    }
  }
});

// createTheme takes an options object as argument containing custom
// colors or typography and return a new theme to the react components. 
let theme = createTheme();
theme = responsiveFontSizes(theme);

function App() {
  const isActive: boolean[] = [false, false, false, false, false, false, false, false ];

  const onActive = (i: number) => {
    isActive.forEach(a => a = false);
    isActive[i] = true;
  }
  
  const onLogout = () => { window.location.href = "http://localhost:3000/user-auth"; }

  let isAuthPage = (window.location.href === "http://localhost:3000/user-auth");
  let presentLink = (isAuthPage) ? 'appLink hideNavLink' : 'appLink';
  let presentLogoutLink = (isAuthPage) ? 'appLink hideNavLink' : 'appLink logout';

  // const populateUser = async () => {
  //   // const token = (typeof localStorage.getItem('token') === "string") ? localStorage.getItem('token') : "";
  //   const request = await fetch('http://localhost:3000/api/users', {
  //     method: 'POST',
  //     headers: {
  //       // 'Content-Type': 'application/json',
	// 			'x-access-token': localStorage.getItem('token') || "",
  //     },
  //   })

  //     const data = request.json();
  //     // console.log(data);
  //   }
  

  // useEffect launch the function in condition that the component is mount! 
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if(token) {
  //     const user = jwt.decode(token)
  //     if(!user) {
  //       localStorage.removeItem('token');
  //       window.location.href = "http://localhost:3000/user-auth";
  //     } else {
  //       populateUser()
  //     }
  //   }
  // },[])

  let StyleActiveOn = { backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  };

  return (
    <div id="rootDiv" ref={React.createRef()}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <AppBar>
            <Toolbar className="appNavBar">
              <NavLink className={`${presentLink} ${(isActive[0]) ? 'active' : ''}`} onClick={() => onActive(0)} activeStyle={StyleActiveOn} to={'/schedule'}>
                <Typography  className="appTg" >
                  <img className="images" alt="schedule" src={Calender} /> Meal Schedule & Overview
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[2]) ? 'active' : ''}`} onClick={() => onActive(1)} activeStyle={StyleActiveOn} to={'/meals'}>
                <Typography className="appTg">
                  <img className="images" alt="chef plan meal" src={ChefMeal} />  Meals Plan
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[2]) ? 'active' : ''}`} onClick={() => onActive(2)} activeStyle={StyleActiveOn} to={'/kitchen-tools'}>
                <Typography className="appTg" >
                  <img className="images L" alt="kitchen tools" src={KitchenTools} />  Kitchen Tools
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[3]) ? 'active' : ''}`} onClick={() => onActive(3)} activeStyle={StyleActiveOn} to={'/food-items'}>
                <Typography className="appTg" >
                  <img className="images" alt="ingredients basket" src={Ingredients} /> Ingredient Variety
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[4]) ? 'active' : ''}`} onClick={() => onActive(4)} activeStyle={StyleActiveOn} to={'/inventory'}>
                <Typography className="appTg" >
                  <img className="images" alt="inventory box" src={InvBox} /> Ingredient Inventory
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[5]) ? 'active' : '' }`} onClick={() => onActive(5)} activeStyle={StyleActiveOn} to={'/buying-list'}>
                <Typography className="appTg" >
                  <img className="images" alt="buying list" src={BuyingList} /> Shopping List
              </Typography>
              </NavLink>
              <NavLink className={`${presentLink} ${(isActive[6]) ? 'active' : ''}`} onClick={() => onActive(6)} activeStyle={StyleActiveOn} to={'/settings'}>
                <Typography className="appTg" >
                  <img className="images" alt="admin settings" src={AdminSettings} />  Admin
              </Typography>
              </NavLink>
              <NavLink className={`${presentLogoutLink} ${(isActive[7]) ? 'active' : ''} `} onClick={() => {onActive(7); onLogout(); }} activeStyle={StyleActiveOn} to={'/user-auth'}>
                <Typography className="appTg" >
                  <img className="images" alt="admin settings" src={LogOut} />  Log Out
              </Typography>
              </NavLink>
              <div className="anim"></div>
            </Toolbar>
          </AppBar>
          <Container maxWidth={false} id="appContainer">
            <Switch>
              <Route path={'/user-auth'} exact component={UserAuthComp} />
              <Route path={'/meals'} exact component={MealListComp} />
              <Route path={'/meals/:id'} exact component={MealComp} />
              <Route path={'/meals/:id/ingredient-note/:id'} exact component={IngredientNoteComp} />
              <Route path={'/kitchen-tools'} exact component={KitchenToolsFunc} />
              <Route path={'/schedule'} exact component={ScheduleTableComp} />
              <Route path={'/food-items'} exact component={FoodItemListComp} />
              <Route path={'/inventory'} exact component={InventoryListComp} />
              <Route path={'/buying-list'} exact component={BuyingListComp} />
              <Route path={'/settings'} exact component={BossSettingsComp} />
              <Route path={'/settings/meal-types'} exact component={BossSettingsComp} />
              <Route path={'/settings/add-date'} exact component={BossSettingsComp} />
              <Route path={'/settings/custom-unit'} exact component={BossSettingsComp} />
              <Route path={'/settings/allergens'} exact component={BossSettingsComp} />
              <Route path={'/settings/limitations'} exact component={BossSettingsComp} />
              <Route path={'/settings/sous-chefs'} exact component={BossSettingsComp} />
              <Route path={'/settings/diners-nutrition'} exact component={BossSettingsComp} />
              <Route path={'/settings/cleaning-crew'} exact component={BossSettingsComp} />
            </Switch>
          </Container>
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;