import React, { PureComponent, Fragment } from 'react';
import { Paper, Typography, TextField, Fab, 
         Icon, IconButton, Box, FormControl, 
         RadioGroup, FormControlLabel, Radio, 
         ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import { observer } from "mobx-react";
import { observable, computed, IReactionDisposer, autorun, action } from 'mobx';
import { Meal } from '../../../models/mealModel';
import { AppRootModel } from '../../../modelsContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SelectedMealStore from '../../../stores/SelectedMealStore';
import MealSelectComp from '../meal-select-comp/mealSelectComp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './dinersNutritionStyle.scss';

type INumDictionary = { [dietType: string]: number; }

@observer
class DinersNutritionComp extends PureComponent {

    disposeAutorun: IReactionDisposer;

    selectedMealStore = new SelectedMealStore();

    @observable dietTypeName: string = "";
    @observable dinersNumber: INumDictionary = {};
    @observable totalDinersNum: number = 0;
    @observable isSetForAllMeals: boolean = true;

    constructor(props: {}) {
        super(props)
        this.disposeAutorun = autorun(() => {
            let meals: Meal[] = AppRootModel.mealModel.items.map(m => m);
            if (this.isSetForAllMeals) {
                meals.forEach(m => m.diners.forEach(d => this.dinersNumber[d.dietType] = d.count));
                this.totalDinersNum = (meals[0]) ? meals[0].getTotalMealDiners() : 0;
            }
            if (this.selectedMealStore.meal) {
                this.dinersNumber = {};
                this.selectedMealStore.meal.diners.forEach(d => this.dinersNumber[d.dietType] = d.count);
                this.totalDinersNum = this.selectedMealStore.meal.getTotalMealDiners();
                console.log(this.selectedMealStore.meal.budget);
            }
            this.refreshData();
        });
    }

    componentWillUnmount() {
        this.disposeAutorun();
    }

    @action refreshData = (): void => {
        if (this.isSetForAllMeals) {
            let meals: Meal[] = AppRootModel.mealModel.items.map(m => m);
            meals.forEach(m => m.diners.forEach(d => this.dinersNumber[d.dietType] = d.count));
            this.totalDinersNum = (meals[0]) ? meals[0].getTotalMealDiners() : 0;
        }
        if (this.selectedMealStore.meal) {
            this.dinersNumber = {};
            this.selectedMealStore.meal.diners.forEach(d => this.dinersNumber[d.dietType] = d.count);
            this.totalDinersNum = this.selectedMealStore.meal.getTotalMealDiners();
        }
    }

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
    }

    @computed get meal(): Meal | undefined {
        return this.selectedMealStore.meal;
    }

    mealInfo(): string {
        let info = "";
        if (this.selectedMealStore.meal) info = `${this.selectedMealStore.meal.chef} - ${this.selectedMealStore.meal.date.toLocaleDateString('en-EN', { weekday: 'long' })} ${this.selectedMealStore.meal.date.toLocaleDateString()}`;
        return info;
    }

    @action onEnterDietTypeName = (e: React.ChangeEvent<any>): void => {
        this.dietTypeName = e.target.value;
    }

    @action onChangeDinersNumber(e: React.ChangeEvent<any>, dietIndex: string): void {
        this.dinersNumber[dietIndex] = Number(e.target.value);
        if (this.selectedMealStore.meal) {
            this.selectedMealStore.meal.updateDietTypeDinersNum(dietIndex, this.dinersNumber[dietIndex]);
        }
        if (this.isSetForAllMeals) AppRootModel.mealModel.items.forEach(m => m.updateDietTypeDinersNum(dietIndex, this.dinersNumber[dietIndex]))
        this.refreshData();
    }

    @action onAddNewDietType(): void {
        if (this.selectedMealStore.meal) this.selectedMealStore.meal.addDietType(this.dietTypeName);
        if (this.isSetForAllMeals) AppRootModel.mealModel.items.forEach(m => m.addDietType(this.dietTypeName));
        this.refreshData();
        this.dietTypeName = "";
    }

    @action onDeleteDietType(dietName: string): void {
        if (this.selectedMealStore.meal) this.selectedMealStore.meal.deleteDietType(dietName);
        if (this.isSetForAllMeals) AppRootModel.mealModel.items.forEach(m => m.deleteDietType(dietName));
        this.refreshData();
    }

    @action onSwitch = (): void => {
        this.isSetForAllMeals = !this.isSetForAllMeals;
        if (this.isSetForAllMeals) this.selectedMealStore.selectedDate = ""; this.selectedMealStore.selectedMeal = ""; this.selectedMealStore.meal = undefined;
        this.refreshData();
    }

    render() {
        let dietTypes: JSX.Element[] = [];
        dietTypes = Object.keys(this.dinersNumber).map(dietType =>
            <div key={dietType} className="dietType">
                <Typography variant="h5" className="tgDiet">{dietType}: </Typography>
                <TextField label="Diners number"
                    value={this.dinersNumber[dietType]}
                    onChange={(e: React.ChangeEvent<any>) => this.onChangeDinersNumber(e, dietType)}
                    variant="outlined"
                    className="txtFldDietType"
                    inputProps={{ type: "number" }}/>
                <IconButton onClick={() => { this.onDeleteDietType(dietType) }}
                    color="secondary"
                    size="medium"
                    style={{
                        marginLeft: 30,
                        visibility: ((Object.values(this.dinersNumber).length > 1 && this.isSetForAllMeals) 
                        || (Object.values(this.dinersNumber).length > 1 && this.selectedMealStore.meal)) ? 'visible' : 'hidden'
                    }}>
                    <DeleteForeverIcon className="dltIcon" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                </IconButton>
            </div>);

        return (
            <Fragment>
                <div className="unVisableBox">
                    <Box id="mobx-update-date-call"
                        visibility="hidden"
                        component="span">
                        {Object.values(this.dinersNumber)}
                    </Box>
                </div>
                <Paper className="paper">
                    <div className="mealSwitchOption">
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={this.isSetForAllMeals}>
                                <FormControlLabel value={true} onClick={() => this.isSetForAllMeals = true} control={<Radio color="primary" checked={this.isSetForAllMeals} />} label={<Box fontSize={24} style={{ marginTop: 6, color: (this.isSetForAllMeals) ? '#3646a3' : 'black', fontWeight: (this.isSetForAllMeals) ? 'bolder' : 'lighter' }}>Set All Meals At Once</Box>} />
                                <FormControlLabel value={false} onClick={() => this.isSetForAllMeals = false} control={<Radio color="primary" checked={!this.isSetForAllMeals} />} label={<Box fontSize={24} style={{ marginTop: 6, color: (!this.isSetForAllMeals) ? '#3646a3' : 'black', fontWeight: (!this.isSetForAllMeals) ? 'bolder' : 'lighter' }}>Select And Set Specific Meal</Box>} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div style={{ visibility: (!this.isSetForAllMeals) ? 'visible' : 'hidden', height: (!this.isSetForAllMeals) ? 'auto' : 0 }}>
                        <MealSelectComp store={this.selectedMealStore} />
                    </div>
                    <div>
                        <Typography variant="h4" className="tgTitle title">
                            {(this.isSetForAllMeals) ? "Update All Exsits Meals" : this.mealInfo()}
                        </Typography>
                        <TextField label="Enter new diet type"
                            onChange={(e: React.ChangeEvent<any>) => { this.onEnterDietTypeName(e) }}
                            value={this.dietTypeName}
                            variant="outlined"
                            className="txtFldDietName"/>
                        <Fab
                            onClick={() => { this.onAddNewDietType() }}
                            variant='extended'
                            color='primary'
                            className="btnAddDiet">
                            <Icon id="icon">add</Icon>Add
                        </Fab>
                        <div style={{ marginTop: 30, marginLeft: 20, visibility: (this.isSetForAllMeals || this.selectedMealStore.meal) ? 'visible' : 'hidden' }}>
                            <div className="ttlDinersForm">
                                <Typography variant="h5" className='tgTtlDiners'>Total Diners: </Typography>
                                <TextField label=""
                                    value={this.totalDinersNum}
                                    variant="outlined"
                                    className="txtFldDiners"/>
                            </div>
                            {dietTypes}
                            <div>
                                <ExpansionPanel key={'info'} className="expnPnl">
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography variant="h6">Important info!</Typography>
                                    </ExpansionPanelSummary>
                                    <p>★ Enter a new diet type, will add each meal the diet category with its diners number.</p>
                                    <p>★ Delete diet type, will remove from each meal that has the category with its diners number.</p>
                                    <p>★ If a new meal is added after setting all meals, it sould be set manually select first the specific meal.</p>
                                    <p>★ Set select all meals, sets a diners number change for all meals that already containing the type.</p>
                                    <p>★ Meals that hasn't the chenged type won't change at all.</p>
                                    <p>★ If there is only one meal with unique type, it will represent among set all meals option. </p>
                                </ExpansionPanel>
                                <br/>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Fragment>
        );
    }
}

export default DinersNutritionComp;