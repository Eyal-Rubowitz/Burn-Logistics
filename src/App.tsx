import React from 'react';
/*
  react-router-dom is made for "Web application" 
  and react-router-native is made for "react native mobile apps"
  both uses react-router at core
*/ 
import { BrowserRouter as Router, NavLink, Switch, Route } from 'react-router-dom';
// import { Switch, Route } from 'react-router';
import {
  AppBar, Typography, Container, Toolbar,
  createMuiTheme, responsiveFontSizes, MuiThemeProvider
} from '@material-ui/core';

import { AppRootModel } from './modelsContext';
import MealComp from './components/meals-comp/mealComp';
import MealListComp from './components/meals-comp/mealListComp';
import ScheduleTableComp from './components/schedule-comp/scheduleComp';
import FoodItemListComp from './components/foodItems-comp/foodItemListComp';
import InventoryListComp from './components/inventory-comp/inventoryComp';
import BuyingListComp from './components/buying-comp/buyingListComp';
import BossSettingsComp from './components/boss-settings-comp/bossSettingsComp';
import IngredientNoteComp from './components/dishes-comp/igredient-note-comp/ingredientNoteComp';
import KitchenToolsFunc from './components/kitchen-tools-comp/kitchenToolsComp';

import ChefMeal from './assets/chefMeal.png';
import Calander from './assets/calendar.png';
import Ingredients from './assets/ingredients.png';
import InvBox from './assets/invBox.png';
import BuyingList from './assets/buyingList.png';
import AdminSettings from './assets/adminSettings.png';
import KitchenTools from './assets/kitchenTools.png';
import './AppStyle/style.scss';

const wsEndpoint = process.env.wsEndpoint || "localhost:3000/ws";

const ws = new WebSocket(`ws://${wsEndpoint}`);
ws.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  console.log('ws data: ', data);
  switch (data.type) {
    case "meal": {
      console.log('meal case');
      AppRootModel.mealModel.updateItemFromServer(data.item);
      break;
    }
    case "dish": {
      console.log('dish case');
      AppRootModel.dishModel.updateItemFromServer(data.item);
      break;
    }
    case "ingredient": {
      console.log('ingredient case');
      AppRootModel.ingredientModel.updateItemFromServer(data.item);
      break;
    }
    case "foodItem": {
      console.log('foodItem case');
      AppRootModel.foodItemModel.updateItemFromServer(data.item);
      break;
    }
    case "inventory": {
      console.log('inventory case');
      AppRootModel.inventoryModel.updateItemFromServer(data.item);
      break;
    }
    case "allergans": {
      console.log('allergans case');
      AppRootModel.allergensModel.updateItemFromServer(data.item);
      break;
    }
    case "kitchenTools": {
      console.log('Kitchen tools case');
      AppRootModel.kitchenToolsModel.updateItemFromServer(data.item);
      console.log('ws: ', data.item);
      break;
    }
  }
});

// createMuiTheme takes an options object as argument 
// containing custom colors or typography
// and return a new theme to the react components. 
let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function App() {

  let isActive: boolean[] = [false, false, false, false, false, false, false ];

  let onActive = (i: number) => {
    isActive.forEach(a => a = false);
    isActive[i] = true;
  }

  return (
    <div id="rootDiv">
      <MuiThemeProvider theme={theme}>
        <Router>
          <AppBar>
            <Toolbar className="appNavBar">
              <NavLink className={`appLink ${(isActive[0]) ? 'active' : ''}`} onClick={() => onActive(0)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/meals'}>
                <Typography className="appTg">
                  <img className="imgs" alt="chef plan meal" src={ChefMeal} />  Meals Plan
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[1]) ? 'active' : ''}`} onClick={() => onActive(1)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/kitchen-tools'}>
                <Typography className="appTg" >
                  <img className="imgs L" alt="kitchen tools" src={KitchenTools} />  Kitchen Tools
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[2]) ? 'active' : ''}`} onClick={() => onActive(2)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/schedule'}>
                <Typography  className="appTg" >
                  <img className="imgs" alt="schedule" src={Calander} /> Meal Schedule & Overview
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[3]) ? 'active' : ''}`} onClick={() => onActive(3)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/food-items'}>
                <Typography className="appTg" >
                  <img className="imgs" alt="ingredients basket" src={Ingredients} /> Ingredient Variety
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[4]) ? 'active' : ''}`} onClick={() => onActive(4)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/inventory'}>
                <Typography className="appTg" >
                  <img className="imgs" alt="inventory box" src={InvBox} /> Ingredient Inventory
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[5]) ? 'active' : ''}`} onClick={() => onActive(5)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/buying-list'}>
                <Typography className="appTg" >
                  <img className="imgs" alt="buing list" src={BuyingList} /> Shopping List
              </Typography>
              </NavLink>
              <NavLink className={`appLink ${(isActive[6]) ? 'active' : ''}`} onClick={() => onActive(6)} activeStyle={{ backgroundColor: 'white', color: '#3646A3', border: 'white 5px solid', borderRadius: '0.25vw', height: '100%', marginTop: '1vh', textShadow: 'none'  }} to={'/settings'}>
                <Typography className="appTg" >
                  <img className="imgs" alt="admin settings" src={AdminSettings} />  Admin
              </Typography>
              </NavLink>
              <div className="anim"></div>
            </Toolbar>
          </AppBar>
          <Container maxWidth={false} id="appContainer">
            <Switch>
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