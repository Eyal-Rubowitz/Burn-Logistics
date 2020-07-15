import React, { PureComponent, Fragment } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { observable, computed } from 'mobx';
import { observer, useLocalStore } from "mobx-react";
import { Meal } from '../../models/mealModel';
import { AppRootModel } from '../../modelsContext';

@observer
class EventSelectComp extends PureComponent {
    
    @observable selectedDate: string = "";
    @observable selectedMeal: string = "";
    @observable meal?: Meal = undefined;

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
    }

    onSelectDate = (date: string): void => {
        this.selectedMeal = "";
        this.meal = undefined;
        this.selectedDate = (date) ? date : "";
    }

    onSelectMeal = (ev: string): void => {
        this.selectedMeal = (ev) ? ev : "";
        this.meal = AppRootModel.mealModel.items.find(m => m.date.toLocaleDateString() === this.selectedDate && m.name === this.selectedMeal);
    }

    render() {
        let choosenDateMeals: Meal[] = this.meals.filter(m => m.date.toLocaleDateString() === this.selectedDate);
        let dateEventListSet: Set<string> = new Set(choosenDateMeals.map(m => m.name));
        let dateEventList: string[] = Array.from(dateEventListSet);
        let dates: Set<string> = new Set(this.meals.map(m => m.date.toLocaleDateString()));
        let mealDateList: string[] = (dates) ? Array.from(dates).map(date => date) : [];
        mealDateList.slice().sort((a, b) => (a > b) ? 1 : -1);

        return (
            <Fragment>
                 <Typography variant="h6">Choose date to set</Typography>
                    <Autocomplete
                        id="combo-box-choosen-day"
                        options={Object.values(mealDateList)}
                        value={this.selectedDate}
                        style={{ width: '100%', marginBottom: 8, display: 'block' }}
                        onChange={(event, value: string) => { this.onSelectDate(value) }}
                        renderInput={params => (
                            <TextField {...params} label="Choose Date" variant="outlined" fullWidth />
                        )} />
                    <Typography variant="h6">Choose meal to set</Typography>
                    <Autocomplete
                        id="combo-box-choosen-event"
                        options={Object.values(dateEventList)}
                        value={this.selectedMeal}
                        style={{ width: '100%', marginBottom: 8, display: 'block' }}
                        onChange={(event, value: string) => { this.onSelectMeal(value) }}
                        renderInput={params => (
                            <TextField {...params} label="Choose meal" variant="outlined" fullWidth />
                        )} />
            </Fragment>
        );
    }
}

export default EventSelectComp;