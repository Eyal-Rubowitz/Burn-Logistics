import React, { PureComponent } from "react";
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import { AppRootModel } from "../modelsContext";
import { FoodItem } from "../models/foodItemModel";
import DatePickerComp from './date-picker-settings-comp/datePickerComp';
import CustomUnitComp from "./custom-unit-settings-comp/customUnitComp";
import MealEventsComp from "./meal-events-comp/mealEventsComp";
import BudgetAndDinersLimitationsComp from "./budget-and-diners-limitations-comp/budgetAndDinersLimitationsComp";
import AllergensComp from "./allergens-comp/allergensComp";
import SousChefsComp from './sous-chefs-comp/sousChefsComp';
import DinersNutritionComp from './diners-nutrition-comp/dinersNutritionComp';

import { Typography, Container, AppBar, Toolbar } from "@material-ui/core";
import { observer } from 'mobx-react';
import { computed } from "mobx";

import MealTime from '../assets/mealTime.png';
import CheckedDate from '../assets/checkedDate.png';
import Measures from '../assets/measures.png';
import Emergency from '../assets/emergency.png';
import Limitations from '../assets/Limitations.png';
import kitchenCrew from '../assets/kitchenCrew.png';
import DietaryConcsernce from '../assets/avoidDiet.png';
import ClieaningCrew from '../assets/cleaningCrew.png';
import CleaningCrewComp from "./cleaning-crew-comp/cleaningCrewComp";

@observer
class BossSettingsComp extends PureComponent {

    @computed get foodItems(): FoodItem[] {
        return AppRootModel.foodItemModel.items.map(f => f);
    }

    render() {
        return (
            <div id='setDiv'>
                <Router>
                    <AppBar >
                        <Toolbar variant="dense" style={{ backgroundColor: '#3646A3', width: '230px', position: 'fixed', height: '100%', left: 0, top: 60 }}>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 10 }} exact to={'/settings/meal-types'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ verticalAlign: 'middle', width: '100px', marginRight: 15 }} alt="meal time" src={MealTime} />
                                    Meal Types
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 110 }} exact to={'/settings/add-date'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ verticalAlign: 'middle', width: '100px', marginRight: 15 }} alt="add date" src={CheckedDate} />
                                    Add Date
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 210 }} exact to={'/settings/custom-unit'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ verticalAlign: 'middle', width: '110px', marginRight: 5 }} alt="custom measures" src={Measures} />
                                    Custom Units
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 310 }} exact to={'/settings/limitations'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '100px', marginRight: 15 }} alt="budget & diners limitations" src={Limitations} />
                                    Settings
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 410 }} exact to={'/settings/allergens'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ marginLeft: 16, verticalAlign: 'middle', width: '60px', marginRight: 40 }} alt="allergens" src={Emergency} />
                                    Allergens
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 510 }} exact to={'/settings/sous-chefs'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '100px', marginRight: 15 }} alt="sous chefs" src={kitchenCrew} />
                                    Chef's Crew
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 610 }} exact to={'/settings/diners-nutrition'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '110px', marginRight: 15 }} alt="dietary conscience" src={DietaryConcsernce} />
                                    Diners Diet
                                </Typography>
                            </NavLink>
                            <NavLink activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} style={{ textDecoration: 'none', color: '#91FFFF', marginLeft: '1%', position: 'absolute', left: 0, top: 710 }} exact to={'/settings/cleaning-crew'}>
                                <Typography variant="h6" style={{ lineHeight: 3.2, marginLeft: 10, marginRight: 5 }} >
                                    <img style={{ display: 'inline-block', verticalAlign: 'middle', width: '110px', marginRight: 15 }} alt="dietary conscience" src={ClieaningCrew} />
                                    Cleaning Crew
                                </Typography>
                            </NavLink>
                        </Toolbar>
                    </AppBar>
                        <Container maxWidth={false} style={{ marginTop: '5%' }}>
                            <Switch>
                                <Route path={'/settings/meal-types'} exact component={MealEventsComp} />
                                <Route path={'/settings/add-date'} exact component={DatePickerComp} />
                                <Route path={'/settings/custom-unit'} exact component={CustomUnitComp} />
                                <Route path={'/settings/limitations'} exact component={BudgetAndDinersLimitationsComp} />
                                <Route path={'/settings/allergens'} exact component={AllergensComp} />
                                <Route path={'/settings/sous-chefs'} exact component={SousChefsComp} />
                                <Route path={'/settings/diners-nutrition'} exact component={DinersNutritionComp} />
                                <Route path={'/settings/cleaning-crew'} exact component={CleaningCrewComp} />
                            </Switch>
                        </Container>
                </Router>
            </div>
        );
    }
}

export default BossSettingsComp;