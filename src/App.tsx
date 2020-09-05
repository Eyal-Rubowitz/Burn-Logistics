import React from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { AppBar, Typography, Container, Toolbar } from '@material-ui/core';

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

const wsEndpoint = process.env.wsEndpoint || "localhost:9000/ws";

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

function App() {
  return (
    <div id="rootDiv">
      <Router>
        <AppBar>
          <Toolbar style={{ backgroundColor: '#3646A3' }}>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%' }} to={'/meals'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '36px' }} alt="chef plan meal" src={ChefMeal} />  Meals Plan
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%' }} to={'/kitchen-tools'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '86px' }} alt="kitchen tools" src={KitchenTools} />  Kitchen Tools
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%' }} to={'/schedule'}>
              <Typography variant="h6" style={{ marginLeft: 20, marginRight: 5, lineHeight: 3.2 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '36px' }} alt="schedule" src={Calander} /> Meal Schedule & Overview
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '3%' }} to={'/food-items'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '40px' }} alt="ingredients basket" src={Ingredients} /> Ingredient Variety
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '3%' }} to={'/inventory'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '40px' }} alt="inventory box" src={InvBox} /> Ingredient Inventory
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '3%', fontSize: '1.25rem' }} to={'/buying-list'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '38px' }} alt="buing list" src={BuyingList} /> Shopping List
              </Typography>
            </NavLink>
            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '3%' }} to={'/settings'}>
              <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 5, marginRight: 5 }} >
                <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '40px' }} alt="admin settings" src={AdminSettings} />  Admin
              </Typography>
            </NavLink>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ marginTop: '5%' }}>
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
    </div>
  );
}

export default App;