import React, { PureComponent } from "react";
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import { AppRootModel } from "../../modelsContext";
import { FoodItem } from "../../models/foodItemModel";
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

import MealTime from '../../assets/mealTime.png';
import CheckedDate from '../../assets/checkedDate.png';
import Measures from '../../assets/measures.png';
import Emergency from '../../assets/emergency.png';
import Limitations from '../../assets/Limitations.png';
import kitchenCrew from '../../assets/kitchenCrew.png';
import DietaryConcsernce from '../../assets/avoidDiet.png';
import ClieaningCrew from '../../assets/cleaningCrew.png';
import CleaningCrewComp from "./cleaning-crew-comp/cleaningCrewComp";
import './bossSettingsStyle.scss';

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
                        <Toolbar variant="dense" id="sideToolBar">
                            <NavLink className="navLink" id="mealType" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/meal-types'}>
                                <img className="img midSize" alt="meal time" src={MealTime} />
                                <Typography variant="h6" className="tgNav">
                                    Meal Types
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="addDate" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/add-date'}>
                                <img className="img midSize" alt="add date" src={CheckedDate} />
                                <Typography variant="h6"className="tgNav">
                                    Add Date
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="customUnit" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/custom-unit'}>
                                <img className="img midSize" alt="custom measures" src={Measures} />
                                <Typography variant="h6" className="tgNav">
                                    Custom Units
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="settings" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/limitations'}>
                                <img className="img midSize" alt="budget & diners limitations" src={Limitations} />
                                <Typography variant="h6" className="tgNav">
                                    Settings
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="allergens" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/allergens'}>
                                <img className="img sSize" alt="allergens" src={Emergency} />
                                <Typography variant="h6" className="tgNav">
                                    Allergens
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="chefsCrew" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/sous-chefs'}>
                                <img className="img midSize" alt="sous chefs" src={kitchenCrew} />
                                <Typography variant="h6" className="tgNav">
                                    Chef's Crew
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink" id="dinersDiet" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/diners-nutrition'}>
                                <img className="img midSize" alt="dietary conscience" src={DietaryConcsernce} />
                                <Typography variant="h6" className="tgNav">
                                    Diners Diet
                                </Typography>
                            </NavLink>
                            <NavLink className="navLink"  id="cleaningCrew" activeStyle={{ backgroundColor: 'white', color: '#3646A3', borderRadius: '5px', width: '100%' }} exact to={'/settings/cleaning-crew'}>
                                <img className="img lSize" alt="dietary conscience" src={ClieaningCrew} />
                                <Typography variant="h6" className="tgNav">
                                    Cleaning Crew
                                </Typography>
                            </NavLink>
                        </Toolbar>
                    </AppBar>
                        <Container maxWidth={false} id="switchContainer">
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