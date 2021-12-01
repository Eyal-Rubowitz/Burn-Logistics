import React, { PureComponent } from "react";
import { Allergens } from '../../../models/allergensModel'
import { AppRootModel } from '../../../modelsContext';
import { observer } from 'mobx-react';
import {
    Typography, TextField, FormControl,
    InputLabel, Select, Fab, Icon,
    MenuItem, Box, IconButton, Paper
} from "@material-ui/core";
import { observable, computed } from "mobx";
import ObjectID from "bson-objectid"; // allows to create & parse ObjectIDs without a reference to the mongodb or bson modules.
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './allergensStyle.scss';

@observer
class AllergensComp extends PureComponent {

    @observable allergenName: string = "";
    @observable selectedAllergenId: string = "";
    @observable newDinerName: string = "";
    @observable selectedFoodItemId: string = "";

    @computed get allergensList(): Allergens[] {
        return AppRootModel.allergensModel.items.map(lrg => lrg);
    }

    onEnterNewAllergy = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.selectedAllergenId = "";
        let val = e.target.value;
        this.allergenName = isNaN(Number(val.slice(-1))) ? val : val.slice(0, -1);
    }

    onAddNewAllergy = (): void => {
        let newId = (new ObjectID()).toHexString()
        let newLRG = new Allergens(AppRootModel.allergensModel, { _id: newId, name: this.allergenName, foodItemIdList: [], dinersNameList: [] })
        AppRootModel.allergensModel.createItem(newLRG);
        this.selectedAllergenId = newId;
    }

    onSelectAllergen = (e: React.ChangeEvent<any>): void => {
        this.selectedAllergenId = e.target.value;
    }

    onEnterDinerName = (e: React.ChangeEvent<any>): void => {
        let val = e.target.value;
        this.newDinerName = isNaN(val.slice(-1)) ? val : val.slice(0, -1);
    }

    onAddNewDiner = (): void => {
        let lrg = AppRootModel.allergensModel.items.find(alrg => alrg._id === this.selectedAllergenId);
        (lrg as Allergens).dinersNameList.push(this.newDinerName);
        AppRootModel.allergensModel.updateItem(lrg as Allergens);
    }

    onSelectAllergenFoodItem = (e: React.ChangeEvent<any>): void => {
        this.selectedFoodItemId = e.target.value;
    }

    onAddFoodItem = (e: React.ChangeEvent<any>): void => {
        let lrg = AppRootModel.allergensModel.items.find(alrg => alrg._id === this.selectedAllergenId);
        (lrg as Allergens).foodItemIdList.push(this.selectedFoodItemId);
        AppRootModel.allergensModel.updateItem(lrg as Allergens);
    }

    render() {

        let lrgDinerList: JSX.Element[] = [];
        let foodItemList: JSX.Element[] = [];
        let lrgFoodList: JSX.Element[] = [];
        let isVisable = false;

        if (this.selectedAllergenId) {
            let selectedLrg = AppRootModel.allergensModel.items.find(lrg => lrg._id === this.selectedAllergenId);
            lrgDinerList = (selectedLrg as Allergens).dinersNameList.map(diner => {
                return (
                    <div className="deleteDiners">
                        <Typography className="tg" variant="h6" key={diner}>{diner}</Typography>
                        <IconButton className="hoverAlertColor" onClick={() => (selectedLrg as Allergens).deleteDinerNameFromList(diner)} size="medium">
                            <DeleteForeverIcon className="dfi" color='secondary'></DeleteForeverIcon>
                        </IconButton>
                    </div>)
            });
            lrgDinerList.unshift(<Typography variant="h6" key={'diner-title'} className="title listTitle">Diners with {(selectedLrg as Allergens).name} intolerance:</Typography>)
            foodItemList = AppRootModel.foodItemModel.items.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(fi => <MenuItem key={fi._id} value={fi._id}>{fi.name}</MenuItem>);
            let lrgFoodIdList = (selectedLrg as Allergens).foodItemIdList.map(lrgFood => lrgFood);
            lrgFoodList = AppRootModel.foodItemModel.items.filter(f => lrgFoodIdList.includes(f._id)).map(f => {
                return (
                    <div className="deleteItems">
                        <Typography className="tg" variant="h6" key={f._id}>{f.name}</Typography>
                        <IconButton onClick={() => (selectedLrg as Allergens).deleteFoodItemFromList(f._id)} color="secondary" size="medium">
                            <DeleteForeverIcon className="dfi" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                        </IconButton>
                    </div>)
            });
            lrgFoodList.unshift(<Typography variant="h6" key={'food-Item-title'} className="title listTitle">Ingredients with intolerance to {(selectedLrg as Allergens).name}:</Typography>)
            isVisable = true;
        }

        return (
            <Paper className="paper">
                <div className="coverdData">
                    <Box id="mobx-update-date-call"
                        component="span">
                        {this.selectedAllergenId}
                    </Box>
                </div>
                <div id="mainLrg">
                    <Typography id="tgLrgTtl" className="title">Allergens</Typography>
                    <TextField label="Enter new intolerance"
                        type="string"
                        onChange={(e: React.ChangeEvent<any>) => { this.onEnterNewAllergy(e) }}
                        value={this.allergenName}
                        variant="outlined"
                        className="txtFld" />
                    <Fab
                        onClick={() => { this.onAddNewAllergy() }}
                        variant='extended'
                        color='primary'
                        className="addBtn btnShiny">
                        <Icon id="icon">add</Icon>Add Intolerance
                </Fab>
                    <FormControl variant="outlined" className="selectLrgForm">
                        <InputLabel id="selectLbl" variant="outlined">Select intolerance</InputLabel>
                        <Select name='select-fi-id' value={this.selectedAllergenId} onChange={(e) => this.onSelectAllergen(e)} >
                            {this.allergensList.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(a => <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div id="dinersInfo">
                    <TextField
                        label="Enter diner name"
                        onChange={(e: React.ChangeEvent<any>) => { this.onEnterDinerName(e) }}
                        value={this.newDinerName}
                        variant="outlined"
                        className={`txtFld ${(isVisable) ? 'vsbl' : 'hide'}`} />
                    <Fab
                        onClick={() => { this.onAddNewDiner() }}
                        variant='extended'
                        color='primary'
                        className={`addBtn btnShiny ${(isVisable) ? 'vsbl' : 'hide'}`} >
                        <Icon id="icon">add</Icon>Add Diner
                    </Fab>
                    {(lrgDinerList.length > 1) ? lrgDinerList : ""}
                </div>
                <div id="lrgnsIngs">
                    <FormControl variant="outlined" 
                                 className={`selectIngForm ${(isVisable) ? 'vsbl' : 'hide'}`} >
                        <InputLabel>Select ingredient</InputLabel>
                        <Select name='select-fi-id' value={this.selectedFoodItemId} onChange={(e) => this.onSelectAllergenFoodItem(e)} >
                            {foodItemList}
                        </Select>
                    </FormControl>
                    <Fab
                        onClick={(e) => { this.onAddFoodItem(e) }}
                        variant='extended'
                        color='primary'
                        className={`addLrgIng btnShiny ${(isVisable) ? 'vsbl' : 'hide'}`} >
                        <Icon>add</Icon>Add allergen Ingredient
                    </Fab>
                    {(lrgFoodList.length > 1) ? lrgFoodList : ""}
                </div>
            </Paper>
        );
    }
}

export default AllergensComp;