import React, { PureComponent } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { observable, computed, action, IReactionDisposer, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { Meal } from '../../../models/mealModel';
import { Autocomplete } from '@material-ui/lab';
import { AppRootModel } from '../../../modelsContext';
import SelectedMealStore from '../../../stores/SelectedMealStore';
import './mealSelectStyle.scss';

type MealSelectCompProps = { store: SelectedMealStore };

@observer
class MealSelectComp extends PureComponent<MealSelectCompProps> {

    disposeAutorun: IReactionDisposer;

    @observable selectedDate: string = "";
    @observable selectedMeal: string = "";
    @observable meal?: Meal = undefined;
    @observable dateList: string[] = [];

    constructor(props: MealSelectCompProps) {
        super(props);
        this.disposeAutorun = autorun(() => {
            this.dateList = this.props.store.dateList;
        });
    }

    componentWillUnmount() {
        this.disposeAutorun();
    }

    @computed get meals(): Meal[] {
        let ml = AppRootModel.mealModel.items.map(m => m);
        return ml;
    }

    @action onSelectDate(date: string): void {
        this.selectedDate = (date) ? date : "";
        this.props.store.selectedDate = this.selectedDate;
        if (!date) this.selectedMeal = "";
    }

    @action onSelectMeal(ev: string): void {
        this.selectedMeal = (ev) ? ev : "";
        this.props.store.selectedMeal = this.selectedMeal;
        this.props.store.meal = AppRootModel.mealModel.items.find(m => m.date.toLocaleDateString() === this.selectedDate && m.name === this.selectedMeal);
    }

    render() {
        let chosenDateMeals: Meal[] = this.meals.filter(m => m.date.toLocaleDateString() === this.selectedDate);
        let dateEventListSet: Set<string> = new Set(chosenDateMeals.map(m => m.name));
        let mealList: string[] = Array.from(dateEventListSet);
        return (
            <div>
                <Typography variant="h6">Choose date to set</Typography>
                <Autocomplete
                    id="combo-box-selected-day"
                    options={Object.values(this.dateList)}
                    className="autoSlctMeal"
                    onChange={(event, value) => { this.onSelectDate((value) ? value : "") }}
                    renderInput={params => (
                        <TextField {...params} label="Choose Date" variant="outlined" fullWidth />
                    )} />
                <Typography variant="h6">Choose meal to set</Typography>
                <Autocomplete
                    id="combo-box-selected-event"
                    options={Object.values(mealList)}
                    className="autoSlctMeal"
                    onChange={(event, value) => { this.onSelectMeal((value) ? value : "") }}
                    clearOnEscape
                    renderInput={params => (
                        <TextField {...params} label="Choose meal" variant="outlined" fullWidth />
                    )} />
            </div>
        );
    }
}

export default MealSelectComp;