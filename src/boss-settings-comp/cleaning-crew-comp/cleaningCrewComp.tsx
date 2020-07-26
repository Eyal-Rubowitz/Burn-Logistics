import React, { PureComponent, Fragment } from 'react';
import {
    Paper, Typography, TextField,
    Fab, Icon, IconButton
} from '@material-ui/core';
import { observer } from "mobx-react";
import { observable, computed, IReactionDisposer, autorun } from 'mobx';
import { Meal } from '../../models/mealModel';
import { AppRootModel } from '../../modelsContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SelectedMealStore from '../../stores/SelectedMealStore';
import MealSelectComp from '../meal-select-comp/mealSelectComp';

@observer
class CleaningCrewComp extends PureComponent {

    disposeAutorun: IReactionDisposer;

    @observable cleaningMemberName: string = "";
    @observable selectedMealStore = new SelectedMealStore();

    constructor(props: {}) {
        super(props);
        this.disposeAutorun = autorun(() => {
                let dates: Set<string> = new Set(this.meals.map(m => m.date.toLocaleDateString()));
                this.selectedMealStore.dateList = (dates) ? [...Array.from(dates).map(date => date)] : [];
        });
    }

    componentWillUnmount(): void {
        this.disposeAutorun();
    }

    @computed get meals(): Meal[] {
        return AppRootModel.mealModel.items.map(m => m);
    }

    @computed get meal(): Meal | undefined {
        return this.selectedMealStore.meal;
    }

    mealInfo(): string {
        let info = "";
        if (this.meal) info = `${this.meal.chef} - ${this.meal.date.toLocaleDateString('en-EN', { weekday: 'long' })} ${this.meal.date.toLocaleDateString()}`;
        return info;
    }

    onEnterCleaningMemberName(e: React.ChangeEvent<any>): void {
        this.cleaningMemberName = e.target.value;
    }

    onAddNewCleaningMember(): void {
        if (this.meal) {
            this.meal.cleaningCrewList.push(this.cleaningMemberName);
            AppRootModel.mealModel.updateItem(this.meal);
            this.cleaningMemberName = '';
        }
    }

    getKitchenCrew(): JSX.Element[] {
        let team: string[] = [];
        if (this.meal) {
            team = this.meal.cleaningCrewList;
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
        // console.log('this.selectedMealStore: ', this.selectedMealStore);
        return (
            <Fragment>
                <Paper style={{ display: 'block', width: '40%', margin: 'auto' }}>
                    <MealSelectComp store={this.selectedMealStore} />
                    <div style={{ visibility: (this.meal !== undefined) ? 'visible' : 'hidden' }}>
                        <Typography variant="h4" style={{ marginTop: 70, marginBottom: 40, textDecoration: 'underline', textAlign: 'center' }}>{this.mealInfo()}</Typography>
                        <TextField label="Enter cleaning member"
                            onChange={(e: React.ChangeEvent<any>) => { this.onEnterCleaningMemberName(e) }}
                            value={this.cleaningMemberName}
                            variant="outlined"
                            style={{ width: '35%', textAlign: 'center' }} />
                        <Fab
                            onClick={() => { this.onAddNewCleaningMember() }}
                            variant='extended'
                            color='primary'
                            style={{ marginLeft: 20, height: 56, width: 180, display: 'inline-block', textAlign: 'center' }}>
                            <Icon>add</Icon>Assign to shift
                        </Fab>
                        <Typography variant="h5" style={{ textDecoration: 'underline', fontWeight: 'bolder', marginTop: 20 }}>{"Cleaning Crew"}</Typography>
                        <Typography variant="h6">{this.getKitchenCrew()}</Typography>
                    </div>
                </Paper>
            </Fragment>
        );
    }
}

export default CleaningCrewComp;