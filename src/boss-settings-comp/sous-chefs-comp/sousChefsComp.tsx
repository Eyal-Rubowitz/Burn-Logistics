import React, { PureComponent, Fragment } from 'react';
import { Paper, Typography, TextField, 
         Fab, Icon, IconButton } from '@material-ui/core';
import { observer } from "mobx-react";
import { observable, computed } from 'mobx';
import { Meal } from '../../models/mealModel';
import { AppRootModel } from '../../modelsContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SelectedMealStore from '../../stores/SelectedMealStore';
import MealSelectComp from '../meal-select-comp/mealSelectComp';

@observer
class SousChefsComp extends PureComponent {

    @observable sousChefName: string = "";
    selectedMealStore = new SelectedMealStore();

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
    }

    @computed get meal() : Meal | undefined {
        return this.selectedMealStore.meal;
    }

    mealInfo(): string {
        let info = "";
        if (this.meal) info = `${this.meal.chef} - ${this.meal.date.toLocaleDateString('en-EN', { weekday: 'long' })} ${this.meal.date.toLocaleDateString()}`;
        return info;
    }

    onEnterSousChefName(e: React.ChangeEvent<any>): void {
        this.sousChefName = e.target.value;
    }

    onAddNewSousChef(): void {
        if (this.meal) {
            this.meal.sousChefList.push(this.sousChefName);
            AppRootModel.mealModel.updateItem(this.meal);
            this.sousChefName = '';
        }
    }

    getKitchenCrew(): JSX.Element[] {
        let team: string[] = [];
        if (this.meal) {
            team = this.meal.sousChefList;
        }

        let crew: JSX.Element[] = team.map(name => {
            return (
                <div>
                    <Typography variant="h6" key={name} style={{ display: 'inline-block' }}>{name}</Typography>
                    <IconButton onClick={() => (this.meal as Meal).deleteSousChefFromList(name)} color="secondary" size="medium">
                        <DeleteForeverIcon style={{ display: 'inline-block' }} fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                    </IconButton>
                </div>
            )
        });

        return crew;
    }

    render() {
        return (
            <Fragment>
                <Paper style={{ display: 'block', width: '40%', margin: 'auto' }}>
                    <MealSelectComp store={this.selectedMealStore} />
                    <div style={{ visibility: (this.meal !== undefined) ? 'visible' : 'hidden' }}>
                        <Typography variant="h4" style={{ marginTop: 70, marginBottom: 40, textDecoration: 'underline', textAlign: 'center' }}>{this.mealInfo()}</Typography>
                        <TextField label="Enter sous chef"
                            onChange={(e: React.ChangeEvent<any>) => { this.onEnterSousChefName(e) }}
                            value={this.sousChefName}
                            variant="outlined"
                            style={{ width: '35%', textAlign: 'center' }} />
                        <Fab
                            onClick={() => { this.onAddNewSousChef() }}
                            variant='extended'
                            color='primary'
                            style={{ marginLeft: 20, height: 56, width: 180, display: 'inline-block', textAlign: 'center' }}>
                            <Icon>add</Icon>Assign to shift
                        </Fab>
                        <Typography variant="h5" style={{ textDecoration: 'underline', fontWeight: 'bolder', marginTop: 20 }}>{"Sous Chef Crew"}</Typography>
                        <Typography variant="h6">{this.getKitchenCrew()}</Typography>
                    </div>
                </Paper>
            </Fragment>
        );
    }
}

export default SousChefsComp;