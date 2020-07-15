import React, { PureComponent } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { observable, computed, action, IReactionDisposer, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { Meal } from '../../models/mealModel';
import { Autocomplete } from '@material-ui/lab';
import { AppRootModel } from '../../modelsContext';
import SelectedMealStore from '../../stores/SelectedMealStore';

type MealSelectCompProps = { store: SelectedMealStore }

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
            this.initDateList();
        })
    }

    componentWillUnmount() {
        this.disposeAutorun();
    }

    @action initDateList() {
        let dates: Set<string> = new Set(this.meals.map(m => m.date.toLocaleDateString()));
        this.dateList = (dates) ? Array.from(dates).map(date => date) : [];
        this.dateList = [...this.dateList.slice().sort((a, b) => (a > b) ? 1 : -1)];
        this.props.store.dateList = this.dateList;
    }

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
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
        let choosenDateMeals: Meal[] = this.meals.filter(m => m.date.toLocaleDateString() === this.selectedDate);
        let dateEventListSet: Set<string> = new Set(choosenDateMeals.map(m => m.name));
        let mealList: string[] = Array.from(dateEventListSet);
        return (
            <div>
                <Typography variant="h6">Choose date to set</Typography>
                <Autocomplete
                    id="combo-box-selected-day"
                    options={Object.values(this.dateList)}
                    style={{ width: '100%', marginBottom: 8, display: 'block' }}
                    onChange={(event, value: string) => { this.onSelectDate(value) }}
                    renderInput={params => (
                        <TextField {...params} label="Choose Date" variant="outlined" fullWidth />
                    )} />
                <Typography variant="h6">Choose meal to set</Typography>
                <Autocomplete
                    id="combo-box-selected-event"
                    options={Object.values(mealList)}
                    style={{ width: '100%', marginBottom: 8, display: 'block' }}
                    onChange={(event, value: string) => { this.onSelectMeal(value) }}
                    clearOnEscape
                    renderInput={params => (
                        <TextField {...params} label="Choose meal" variant="outlined" fullWidth />
                    )} />
            </div>
        );
    }
}

export default MealSelectComp;