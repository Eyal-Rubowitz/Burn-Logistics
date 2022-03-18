import React, { PureComponent } from 'react';
import { TextField, Fab, Typography, 
         Icon, ExpansionPanelSummary, 
         ExpansionPanel, Paper } from '@material-ui/core';
import { computed, observable } from 'mobx';
import { AppRootModel } from '../../../modelsContext';
import { observer } from 'mobx-react';
import ObjectID from "bson-objectid";
import { Meal } from "../../../models/mealModel";
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DatePickerComp from "../date-picker-settings-comp/datePickerComp";
import './mealEventsStyle.scss';

@observer
class MealEventsComp extends PureComponent {

    @observable tempMealEventText: string = '';

    @computed get getSelectedDate(): Date {
        return DatePickerComp.prototype.selectedDay;
    }

    onTextChange = (e: React.ChangeEvent<any>): void => {
        let val = e.target.value;
        this.tempMealEventText = val;
    }

    onAddMealCategory = (): void => {
        if (this.tempMealEventText === '') return;
        let newId: string = (new ObjectID()).toHexString();
        let newMeal: Meal = new Meal(AppRootModel.mealModel, { _id: newId, chef: "Chef Name", date: this.getSelectedDate, name: this.tempMealEventText });
        AppRootModel.mealModel.createObject(newMeal);
        this.tempMealEventText = '';
    }

    render() {
        let mealItems: Meal[] = AppRootModel.mealModel.objectList;
        let mealCategories: Set<string> = new Set(mealItems.map(m => m.declaredType));
        let mealCategoryList: JSX.Element[] = Array.from(mealCategories).map(cat => <Typography variant="h6" key={cat}>{cat}</Typography>);
        return (
            <div>
                <div className="unVisBox">
                    <Box id="mobx-update-date-call"
                        visibility="hidden"
                        component="span">
                        {this.getSelectedDate.toLocaleDateString()}
                    </Box>
                </div>
                <Paper className="paper">
                <Typography variant="h6" className="title">Meal Types</Typography>
                {mealCategoryList}
                <TextField label="Enter a new meal type"
                    value={this.tempMealEventText}
                    onChange={this.onTextChange}
                    variant="outlined"
                    fullWidth
                    className="formMealName"/>
                <Fab onClick={this.onAddMealCategory}
                    variant='extended'
                    color='primary'
                     className="formMealName btnShiny">
                    <Icon id="icon">add</Icon>Add Category
                </Fab>
                <ExpansionPanel key={'info'}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <Typography variant="h6">Important info!</Typography>
                    </ExpansionPanelSummary>
                    <p>★ This action adds new meal with new type at the selected date from Meal Days chart.</p>
                    <p>★ As the order you enter the meal types, so they will represent in the options to select. </p>
                    <p>★ Delete the last meal that contains a certain type, will delete the specific type option too from the list.</p>
                </ExpansionPanel>
                </Paper>
            </div>
        );
    }
}

export default MealEventsComp;