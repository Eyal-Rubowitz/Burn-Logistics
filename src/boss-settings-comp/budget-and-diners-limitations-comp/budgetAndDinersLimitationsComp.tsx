import React, { PureComponent } from 'react';
import { AppRootModel } from '../../modelsContext';
import { observer } from 'mobx-react';
import { observable, computed, IReactionDisposer, autorun } from 'mobx';
import { Meal } from '../../models/mealModel';
import {
    Typography, TextField, Checkbox,
    FormControlLabel, Fab, Icon,
    Divider, Paper, FormControl, RadioGroup, Radio, Box
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import SelectedMealStore from '../../stores/SelectedMealStore';
import MealSelectComp from '../meal-select-comp/mealSelectComp';

type INumDictionary = { [index: string]: number; };
type IBoolDictionary = { [index: string]: boolean; };

@observer
class BudgetAndDinersLimitationsComp extends PureComponent {

    disposeAutorun: IReactionDisposer;

    selectedMealStore = new SelectedMealStore();

    @observable switchCondition: boolean = true;
    @observable diners: number = 0;
    @observable totalBudget: number = 0;
    @observable mealBudget: INumDictionary = {};
    @observable portion: INumDictionary = {};
    @observable holdBudget: IBoolDictionary = {};

    @observable selectedDate: string = "";
    @observable selectedMeal: string = "";

    @observable isChoosenMealUpdated: boolean = false;

    constructor(props: {}) {
        super(props)
        this.disposeAutorun = autorun(() => {
            let mealList: Meal[] = this.meals.map(m => m);
            let ttlBgtList: number[] = mealList.map(m => m.budget);
            this.totalBudget = (ttlBgtList && ttlBgtList[ttlBgtList.length - 1] !== undefined) ? ttlBgtList.reduce((ttl, bgt) => ttl + bgt) : 0;
            this.diners = (mealList.length > 0) ? mealList[0].totalDiners : 0;
            mealList.forEach((m) => {
                this.mealBudget[m._id] = m.budget;
                this.mealBudget[m.name] = m.budget;
                this.portion[m._id] = m.portion;
                this.portion[m.name] = m.portion;
                this.holdBudget[m.name] = false;
            });
        });
    }

    componentWillUnmount(): void {
        this.disposeAutorun();
    }

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
    }

    onSwitch = (): void => {
        this.switchCondition = !this.switchCondition;
        if (!this.switchCondition) this.selectedMealStore.selectedDate = ""; this.selectedMealStore.selectedMeal = ""; this.selectedMealStore.meal = undefined;
    }

    onEnterDinersNum = (e: React.ChangeEvent<any>): void => {
        this.diners = Number(e.target.value);
    }

    onEnterTotalBudget = (e: React.ChangeEvent<any>): void => {
        this.totalBudget = Number(e.target.value);
    }

    onSelectDate = (select: string): void => {
        this.selectedMealStore.selectedDate = select;
    }

    onSelectMeal = (select: string): void => {
        this.selectedMealStore.selectedMeal = select;
    }

    onBudgetChange = (e: React.ChangeEvent<any>, i: string): void => {
        let dailyMealsBudget = 0;
        let events = 0;
        if (this.isEvent(i)) {
            Object.keys(this.mealBudget).forEach((key: string): void => {
                if (this.isEvent(key) && this.holdBudget[key] === false) {
                    dailyMealsBudget += this.mealBudget[key];
                    events += 1;
                }
            });
        }
        // i - can represent meal._id or meal.name
        this.mealBudget[i] = Number(e.target.value);
        if (events === 0) return;
        if (this.isEvent(i)) {
            let restDailyBudget = dailyMealsBudget - this.mealBudget[i];
            let restEventBudget = restDailyBudget / (events - 1);
            Object.keys(this.mealBudget).forEach((key: string) => {
                debugger;
                if (this.isEvent(key) && key !== i && this.holdBudget[key] === false) {
                    this.mealBudget[key] = restEventBudget;
                }
            });
        }
    }

    checkForHexRegExpObjectID = new RegExp("^[0-9a-fA-F]{24}$");
    isEvent(index: string): boolean {
        let test = !this.checkForHexRegExpObjectID.test(index);
        return test;
    }

    onPortionChange = (e: React.ChangeEvent<any>, i: string): void => {
        // i - can represent meal._id or meal.name
        this.portion[i] = Number(e.target.value);
    }

    onHoldEventBudget = (ev: string): void => {
        this.holdBudget[ev] = !this.holdBudget[ev];
    }

    onSetLimitations = (meal?: Meal): void => {
        let mealModel = AppRootModel.mealModel;
        if (meal) {
            meal.diners.push({ "count": this.diners, "dietType": "Omnivor" });
            meal.budget = this.mealBudget[meal._id];
            meal.portion = this.portion[meal._id];
            mealModel.updateItem(meal);
        } else {
            mealModel.items.forEach(m => {
                m.diners.push({ "count": this.diners, "dietType": "Omnivor" });
                m.budget = this.mealBudget[m.name];
                m.portion = this.portion[m.name];
                mealModel.updateItem(m);
            });
        }
    }

    render() {
        let dates: Set<string> = new Set(this.meals.map(m => m.date.toLocaleDateString()));
        let mealDateList: string[] = (dates) ? Array.from(dates).map(date => date) : [];
        mealDateList.slice().sort((a, b) => (a > b) ? 1 : -1);
        let dailyBudget: number = Number((this.totalBudget / (mealDateList.length)).toFixed(2));
        let events: Set<string> = new Set(this.meals.map(m => m.name));
        let eventList: JSX.Element[] = Array.from(events).map(
            (ev, i) =>
                <div key={i}>
                    <Typography variant="h6" style={{ marginTop: 20, marginBottom: 6, textDecoration: 'underline' }} >{ev}: </Typography>
                    <TextField label="Meal budget ₪"
                        onChange={(e: React.ChangeEvent<any>) => { this.onBudgetChange(e, ev) }}
                        value={this.mealBudget[ev]}
                        variant="outlined"
                        style={{ width: '30%', margin: 2, display: 'inline-block' }}
                        inputProps={{
                            type: "number"
                        }} />
                    <TextField label="Per diner ₪"
                        value={`${((this.mealBudget[ev]) / (this.diners) || 0).toFixed(2)}`}
                        variant="filled"
                        style={{ width: '30%', margin: 2, display: 'inline-block', pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }} />
                    <FormControlLabel
                        label={<Typography variant="h6">Hold budget</Typography >}//"hold budget"
                        style={{ width: 'auto', marginLeft: 6, fontWeight: 'bolder' }}
                        labelPlacement="end"
                        control={
                            <Checkbox
                                color="primary"
                                name="hold"
                                value="SomeValue"
                                onChange={() => this.onHoldEventBudget(ev)} />
                        } />
                    <TextField label="Diner portion in gr'"
                        onChange={(e: React.ChangeEvent<any>) => { this.onPortionChange(e, ev) }}
                        value={this.portion[ev]}
                        variant="outlined"
                        style={{ width: '40%', margin: 4, display: 'block', marginBottom: 8 }}
                        inputProps={{
                            type: "number"
                        }} />
                    <Divider />
                </div>
        );
        let choosenDateMeals: Meal[] = this.meals.filter(m => m.date.toLocaleDateString() === this.selectedMealStore.selectedDate);
        let totalEventExpense: number = Array.from(events).reduce((ttl, ev) => ttl + this.mealBudget[ev], 0);
        let choosenMeal: Meal[] = choosenDateMeals.filter(m => m.name === this.selectedMealStore.selectedMeal);
        let choosenMealEvent: JSX.Element[] = choosenMeal.map((m, i) =>
            <div key={i}>
                <Typography variant="h6"
                    key={m._id}
                    style={{ display: 'inline-block', minWidth: '70px' }}>
                    {m.name}:
                </Typography>
                <TextField label="Budget ₪"
                    value={this.mealBudget[m._id]}
                    onChange={(e: React.ChangeEvent<any>) => this.onBudgetChange(e, m._id)}
                    variant="outlined"
                    style={{ display: 'inline-block', width: '80px', margin: 1 }}
                    inputProps={{
                        type: "number"
                    }} />
                <TextField label="Diners"
                    value={this.diners}
                    onChange={(e: React.ChangeEvent<any>) => this.onEnterDinersNum(e)}
                    variant="outlined"
                    style={{ display: 'inline-block', width: '80px', margin: 1 }}
                    inputProps={{
                        type: "number"
                    }} />
                <TextField label="Diner portion in gr'"
                    onChange={(e: React.ChangeEvent<any>) => this.onPortionChange(e, m._id)}
                    value={this.portion[m._id]}
                    variant="outlined"
                    style={{ display: 'inline-block', width: '135px', margin: 1 }}
                    inputProps={{
                        type: "number"
                    }} />
                <Fab
                    onClick={() => { this.onSetLimitations(m); this.isChoosenMealUpdated = true; }}
                    variant='extended'
                    color='primary'
                    style={{ margin: 2, maxWidth: 150 }}>
                    <Icon>add</Icon>Set Budget & Diners
                </Fab>
                <ToggleButton value={this.isChoosenMealUpdated} style={{ marginLeft: 10, visibility: (this.isChoosenMealUpdated) ? 'visible' : 'hidden' }}>
                    <CheckIcon style={{ display: 'inline-block', color: 'blue', marginRight: 20 }} />  Updated Done!
                </ToggleButton>
            </div>);

        return (
            <Paper style={{ width: 800, padding: 8, position: 'fixed', left: '34%', top: '10%' }}>
                <Typography variant="h6" style={{ textDecoration: 'underline' }} >Budget & Diners Limitations</Typography>
                <div style={{ marginTop: 6, marginLeft: 12, display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" value={this.switchCondition}>
                            <FormControlLabel value={true} onClick={() => this.switchCondition = true} control={<Radio color="primary" checked={this.switchCondition} />} label={<Box fontSize={18} style={{ marginTop: 6, color: (this.switchCondition) ? '#3646a3' : 'black', fontWeight: (this.switchCondition) ? 'bolder' : 'lighter' }}>Set All Meals At Once</Box>} />
                            <FormControlLabel value={false} onClick={() => this.switchCondition = false} control={<Radio color="primary" checked={!this.switchCondition} />} label={<Box fontSize={18} style={{ marginTop: 6, color: (!this.switchCondition) ? '#3646a3' : 'black', fontWeight: (!this.switchCondition) ? 'bolder' : 'lighter' }}>Select And Set Specific Meal</Box>} />
                        </RadioGroup>
                    </FormControl>
                </div>
                {(this.switchCondition) ? <div>
                    <TextField label="Diners number"
                        onChange={(e: React.ChangeEvent<any>) => { this.onEnterDinersNum(e) }}
                        value={this.diners}
                        variant="outlined"
                        style={{ width: '25%', margin: 1, display: 'inline-block' }}
                        inputProps={{
                            type: "number",
                            min: 0
                        }} />
                    <TextField label="Total budget &nbsp; ₪"
                        onChange={(e: React.ChangeEvent<any>) => { this.onEnterTotalBudget(e) }}
                        value={this.totalBudget}
                        variant="outlined"
                        style={{ display: 'inline-block', width: '55%', margin: 1, marginLeft: 16 }}
                        inputProps={{
                            type: "number",
                            // startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                            min: 0,
                        }} />
                    <TextField label="Total meal days"
                        value={mealDateList.length}
                        variant="filled"
                        style={{ width: '27%', margin: 1, display: 'inline-block', pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }} />
                    <TextField label="Total meals"
                        value={this.meals.length}
                        variant="filled"
                        style={{ display: 'inline-block', width: '55%', margin: 1, pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }} />
                    <TextField label="Daily budget (average) ₪"
                        value={dailyBudget | 0}
                        variant="filled"
                        style={{ display: 'inline-block', width: '27%', margin: 1, pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }}
                        InputProps={{
                            style: {
                                backgroundColor: (dailyBudget > totalEventExpense) ? '#dddddd' : '#FFE4E1'
                            }
                        }} />
                    <TextField label="Daily cumulative expenses ₪"
                        value={totalEventExpense}
                        variant="filled"
                        style={{ display: 'inline-block', width: '27%', margin: 1, marginBottom: 10, pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }} />
                    <TextField label="Daily average budget per diner ₪"
                        value={(dailyBudget / (this.diners) ? this.diners : 0).toFixed(2)}
                        variant="filled"
                        style={{ display: 'inline-block', width: '24%', margin: 1, marginBottom: 10, pointerEvents: 'none' }}
                        InputLabelProps={{
                            "aria-readonly": true,
                        }} />
                    {eventList}
                    <Fab
                        onClick={() => { this.onSetLimitations() }}
                        variant='extended'
                        color='primary'
                        style={{ margin: 2, maxWidth: 150 }}>
                        <Icon>add</Icon>Set Budget & Diners
                    </Fab>
                </div> : <div>
                        <div style={{ width: 300, marginBottom: 8 }}>
                            <MealSelectComp store={this.selectedMealStore} />
                        </div>
                        {choosenMealEvent}
                    </div>}
            </Paper>
        );
    }
}

export default BudgetAndDinersLimitationsComp;