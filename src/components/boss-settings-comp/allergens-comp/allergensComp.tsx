import React, { PureComponent } from "react";
import { Allergans } from '../../../models/allergensModel'
import { AppRootModel } from '../../../modelsContext';
import { observer } from 'mobx-react';
import {
    Typography, TextField, FormControl,
    InputLabel, Select, Fab, Icon,
    MenuItem, Box, IconButton, Paper
} from "@material-ui/core";
import { observable, computed } from "mobx";
import ObjectID from "bson-objectid";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './allergansStyle.scss';

@observer
class AllergensComp extends PureComponent {

    @observable allerganName: string = "";
    @observable selectedAllerganId: string = "";
    @observable newDinerName: string = "";
    @observable selectedFoodItemId: string = "";

    @computed get allergansList(): Allergans[] {
        return AppRootModel.allergensModel.items.map(lrg => lrg);
    }

    onEnterNewAllrgy = (e: React.ChangeEvent<any>): void => {
        this.selectedAllerganId = "";
        let val = e.target.value;
        this.allerganName = isNaN(val.slice(-1)) ? val : val.slice(0, -1);
    }

    onAddNewAllergy = (): void => {
        let newId = (new ObjectID()).toHexString()
        let newLRG = new Allergans(AppRootModel.allergensModel, { _id: newId, name: this.allerganName, foodItemIdList: [], dinersNameList: [] })
        AppRootModel.allergensModel.createItem(newLRG);
        this.selectedAllerganId = newId;
    }

    onSelectAllergan = (e: React.ChangeEvent<any>): void => {
        this.selectedAllerganId = e.target.value;
    }

    onEnterDinerName = (e: React.ChangeEvent<any>): void => {
        let val = e.target.value;
        this.newDinerName = isNaN(val.slice(-1)) ? val : val.slice(0, -1);
    }

    onAddNewDiner = (): void => {
        let lrg = AppRootModel.allergensModel.items.find(alrg => alrg._id === this.selectedAllerganId);
        (lrg as Allergans).dinersNameList.push(this.newDinerName);
        AppRootModel.allergensModel.updateItem(lrg as Allergans);
    }

    onSelectAlerganFoodItem = (e: React.ChangeEvent<any>): void => {
        this.selectedFoodItemId = e.target.value;
    }

    onAddFoodItem = (e: React.ChangeEvent<any>): void => {
        let lrg = AppRootModel.allergensModel.items.find(alrg => alrg._id === this.selectedAllerganId);
        (lrg as Allergans).foodItemIdList.push(this.selectedFoodItemId);
        AppRootModel.allergensModel.updateItem(lrg as Allergans);
    }

    render() {

        let lrgDinerList: JSX.Element[] = [];
        let foodItemList: JSX.Element[] = [];
        let lrgFoodList: JSX.Element[] = [];
        let isVisable = false;

        if (this.selectedAllerganId) {
            let selectedLrg = AppRootModel.allergensModel.items.find(lrg => lrg._id === this.selectedAllerganId);
            lrgDinerList = (selectedLrg as Allergans).dinersNameList.map(diner => {
                return (
                    <div className="deleteDiners">
                        <Typography className="tg" variant="h6" key={diner}>{diner}</Typography>
                        <IconButton onClick={() => (selectedLrg as Allergans).deleteDinerNameFromList(diner)} color="secondary" size="medium">
                            <DeleteForeverIcon className="dfi" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                        </IconButton>
                    </div>)
            });
            lrgDinerList.unshift(<Typography variant="h6" key={'diner-title'} className="title listTitle">Diners with {(selectedLrg as Allergans).name} intolerance:</Typography>)
            foodItemList = AppRootModel.foodItemModel.items.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(fi => <MenuItem key={fi._id} value={fi._id}>{fi.name}</MenuItem>);
            let lrgFoodIdList = (selectedLrg as Allergans).foodItemIdList.map(lrgFood => lrgFood);
            lrgFoodList = AppRootModel.foodItemModel.items.filter(f => lrgFoodIdList.includes(f._id)).map(f => {
                return (
                    <div className="deleteItems">
                        <Typography className="tg" variant="h6" key={f._id}>{f.name}</Typography>
                        <IconButton onClick={() => (selectedLrg as Allergans).deleteFoodItemFromList(f._id)} color="secondary" size="medium">
                            <DeleteForeverIcon className="dfi" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                        </IconButton>
                    </div>)
            });
            lrgFoodList.unshift(<Typography variant="h6" key={'food-Item-title'} className="title listTitle">Ingredients with intolerance to {(selectedLrg as Allergans).name}:</Typography>)
            isVisable = true;
        }

        return (
            <Paper className="paper">
                <div className="coverdData">
                    <Box id="mobx-update-date-call"
                        component="span">
                        {this.selectedAllerganId}
                    </Box>
                </div>
                <div id="mainLrg">
                    <Typography id="tgLrgTtl" className="title">Allergens</Typography>
                    <TextField label="Enter new intolerance"
                        onChange={(e) => { this.onEnterNewAllrgy(e) }}
                        value={this.allerganName}
                        variant="outlined"
                        className="txtFld" />
                    <Fab
                        onClick={() => { this.onAddNewAllergy() }}
                        variant='extended'
                        color='primary'
                        className="addBtn">
                        <Icon id="icon">add</Icon>Add Intolerance
                </Fab>
                    <FormControl variant="outlined" className="selectLrgForm">
                        <InputLabel id="selectLbl" variant="outlined">Select intolerance</InputLabel>
                        <Select name='select-fi-id' value={this.selectedAllerganId} onChange={(e) => this.onSelectAllergan(e)} >
                            {this.allergansList.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(a => <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div id="dinersInfo">
                    <TextField
                        label="Enter diner name"
                        onChange={(e) => { this.onEnterDinerName(e) }}
                        value={this.newDinerName}
                        variant="outlined"
                        className="txtFld"
                        style={{ visibility: (isVisable) ? 'visible' : 'hidden' }} />
                    <Fab
                        onClick={() => { this.onAddNewDiner() }}
                        variant='extended'
                        color='primary'
                        className="addBtn"
                        style={{ visibility: (isVisable) ? 'visible' : 'hidden' }}>
                        <Icon id="icon">add</Icon>Add Diner
                    </Fab>
                    {(lrgDinerList.length > 1) ? lrgDinerList : ""}
                </div>
                <div id="lrgnsIngs">
                    <FormControl variant="outlined" className="selectIngForm" style={{ visibility: (isVisable) ? 'visible' : 'hidden' }} >
                        <InputLabel>Select ingredient</InputLabel>
                        <Select name='select-fi-id' value={this.selectedFoodItemId} onChange={(e) => this.onSelectAlerganFoodItem(e)} >
                            {foodItemList}
                        </Select>
                    </FormControl>
                    <Fab
                        onClick={(e) => { this.onAddFoodItem(e) }}
                        variant='extended'
                        color='primary'
                        style={{ margin: 6, visibility: (isVisable) ? 'visible' : 'hidden' }}>
                        <Icon>add</Icon>Add allergan Ingredient
                    </Fab>
                    {(lrgFoodList.length > 1) ? lrgFoodList : ""}
                </div>
            </Paper>
        );
    }
}

export default AllergensComp;