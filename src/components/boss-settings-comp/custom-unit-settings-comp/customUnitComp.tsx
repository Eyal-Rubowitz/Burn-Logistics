import React, { PureComponent } from 'react';
import {
    TextField, FormControl, Select,
    MenuItem, Fab, Icon, InputLabel, Typography,
    IconButton, ExpansionPanel, ExpansionPanelSummary, Paper
} from '@material-ui/core';
import { computed, observable } from 'mobx';
import { FoodItem, CustomUnit } from '../../../models/foodItemModel';
import { AppRootModel } from '../../../modelsContext';
import { observer } from 'mobx-react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './customUnitStyle.scss';

@observer
class CustomUnitComp extends PureComponent {

    @observable selectedFoodItemId: string = "";
    @observable newCustomUnitName: string = "";
    @observable baseUnit: string = "";
    @observable ratioQuantity: number = 0;
    @observable foodItem?: FoodItem;

    @computed get foodItems(): FoodItem[] {
        return AppRootModel.foodItemModel.items.map(f => f);
    }

    checkForHexRegExpObjectID: RegExp = new RegExp("^[0-9a-fA-F]{24}$");
    onSelectFoodItem = (e: React.ChangeEvent<any>): void => {
        if (this.checkForHexRegExpObjectID.test(e.target.value)) {
            this.selectedFoodItemId = e.target.value;
            this.foodItem = AppRootModel.foodItemModel.items.find(fi => fi._id === this.selectedFoodItemId);
            this.baseUnit = (this.foodItem as FoodItem).baseUnit;
        }
    }

    onEnterCustomUnit = (e: React.ChangeEvent<any>): void => {
        let val = e.target.value;
        this.newCustomUnitName = isNaN(val) ? val : val.slice(0, -1);
    }

    onEnterQuantity = (e: React.ChangeEvent<any>): void => {
        this.ratioQuantity = Number(e.target.value);
    }

    onUpdateCustomUnit = (): void => {
        if (this.foodItem) {
            let cu: CustomUnit | undefined = this.foodItem.customUnits.slice().sort((a, b) => b.ratio - a.ratio).find(cu => cu.unitName === this.newCustomUnitName)
            if (!cu) {
                this.foodItem.customUnits.push({ unitName: this.newCustomUnitName, ratio: this.ratioQuantity });
                AppRootModel.foodItemModel.updateItem(this.foodItem);
            }
            this.selectedFoodItemId = "";
            this.newCustomUnitName = "";
            this.baseUnit = "";
            this.ratioQuantity = 0;
        };
    }

    render() {
        let customUnitList: JSX.Element[] | undefined  = (this.foodItem) ?
            this.foodItem.customUnits.map(cu => {
                return (
                    <div>
                        <Typography variant="h6" key={cu.unitName} className="btnDltCstmUn">{cu.unitName} - {cu.ratio}{this.baseUnit}</Typography>
                        <IconButton className="hoverAlertColor" onClick={() => { (this.foodItem as FoodItem).deleteCustomUnit(cu.unitName) }} color="secondary" size="medium">
                            <DeleteForeverIcon className="dltIcon" fontSize="default" color='secondary' enableBackground="red"></DeleteForeverIcon>
                        </IconButton>
                    </div>
                )
            }) : undefined;
        return (
            <>
                <Paper className="paper">
                    <Typography variant="h6" className="title">Ingredient Custom Units</Typography>
                    <div id="cstmUnLs">
                        {customUnitList}
                    </div>
                    <FormControl variant="outlined" className="formInput">
                        <InputLabel id="slctIngLabel">Select Ingredient</InputLabel>
                        <Select name='select-fi-id' value={this.selectedFoodItemId} onChange={(e) => this.onSelectFoodItem(e)} >
                            {this.foodItems.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(f => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Enter new custom unit"
                        onChange={(e) => { this.onEnterCustomUnit(e) }}
                        value={this.newCustomUnitName}
                        variant="outlined"
                        fullWidth
                        className="formInput"/>
                    <FormControl variant="outlined" className="itemData">
                        <TextField label="Item base unit"
                            variant="outlined"
                            value={this.baseUnit}
                            className="noPointer"
                            InputLabelProps={{ "aria-readonly": true }}>
                        </TextField>
                    </FormControl>
                    <TextField label="Quantity"
                         className="itemData mrgLft"
                        onChange={(e) => { this.onEnterQuantity(e) }}
                        variant="outlined"
                        value={this.ratioQuantity}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        fullWidth />
                    <Fab
                        onClick={() => { this.onUpdateCustomUnit() }}
                        variant='extended'
                        color='primary'
                        className="btnUn btnShiny">
                        <Icon id="icon">add</Icon>Add Custom Unit
                </Fab>
                    <ExpansionPanel key={'info'}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography variant="h6">Important info!</Typography>
                        </ExpansionPanelSummary>
                        <p>★ Custom unit can be deleted from food item only if no chef use ingredient that includes this custom unit.</p>
                    </ExpansionPanel>
                </Paper>
            </>
        );
    }
}

export default CustomUnitComp;