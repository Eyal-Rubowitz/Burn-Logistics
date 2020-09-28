import React, { PureComponent, Fragment } from 'react';
import { Paper, Typography, TextField, 
         Fab, Icon, IconButton } from '@material-ui/core';
import { observer } from "mobx-react";
import { observable, computed, IReactionDisposer, autorun } from 'mobx';
import { Meal } from '../../../models/mealModel';
import { AppRootModel } from '../../../modelsContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SelectedMealStore from '../../../stores/SelectedMealStore';
import MealSelectComp from '../meal-select-comp/mealSelectComp';
import './sousChefsStyle.scss';

@observer
class SousChefsComp extends PureComponent {

    disposeAutorun: IReactionDisposer;

    selectedMealStore = new SelectedMealStore();
   
    @observable sousChefName: string = "";

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
                    <Typography variant="h6" key={name} className="inlinblock">{name}</Typography>
                    <IconButton className="hoverAlertColor" onClick={() => (this.meal as Meal).deleteSousChefFromList(name)} color="secondary" size="medium">
                        <DeleteForeverIcon className="inlinblock" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                    </IconButton>
                </div>
            )
        });

        return crew;
    }

    render() {
        return (
            <Fragment>
                <Paper className="paper">
                    <MealSelectComp store={this.selectedMealStore} />
                    <div className={`${(this.meal !== undefined) ? 'vsbl' : 'hide'}`}>
                        <Typography variant="h4" className="tgMealInfo">{this.mealInfo()}</Typography>
                        <TextField label="Enter sous chef"
                            onChange={(e: React.ChangeEvent<any>) => { this.onEnterSousChefName(e) }}
                            value={this.sousChefName}
                            variant="outlined"
                            className="txtFldSousInput"/>
                        <Fab
                            onClick={() => { this.onAddNewSousChef() }}
                            variant='extended'
                            color='primary'
                            className="btnAddSous btnShiny">
                            <Icon id="icon">add</Icon>Assign to shift
                        </Fab>
                        <Typography variant="h5" className="sousTtl">Sous Chef Crew</Typography>
                        <Typography variant="h6">{this.getKitchenCrew()}</Typography>
                    </div>
                </Paper>
            </Fragment>
        );
    }
}

export default SousChefsComp;