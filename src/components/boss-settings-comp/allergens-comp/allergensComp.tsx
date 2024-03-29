import React, { PureComponent } from "react";
import { Allergens } from "../../../models/allergensModel";
import { AppRootModelsContext } from "../../../App";
import { observer } from "mobx-react";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Fab,
  Icon,
  MenuItem,
  Box,
  IconButton,
  Paper,
} from "@material-ui/core";
import { observable, computed } from "mobx";
// allows to create & parse ObjectIDs without a reference to the mongodb or bson modules.
import ObjectID from "bson-objectid";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import "./allergensStyle.scss";

@observer
class AllergensComp extends PureComponent {
  @observable allergenName: string = "";
  @observable selectedAllergenId: string = "";
  @observable newDinerName: string = "";
  @observable selectedFoodItemId: string = "";

  @computed get allergensList(): Allergens[] {
    return AppRootModelsContext.allergensModel.objectList.map((lrg) => lrg);
  }

  onEnterNewAllergy = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.selectedAllergenId = "";
    let val = e.target.value;
    this.allergenName = isNaN(Number(val.slice(-1))) ? val : val.slice(0, -1);
  };

  onAddNewAllergy = (): void => {
    let newId = new ObjectID().toHexString();
    let newLRG = new Allergens(AppRootModelsContext.allergensModel, {
      _id: newId,
      name: this.allergenName,
      foodItemIdList: [],
      dinersNameList: [],
    });
    AppRootModelsContext.allergensModel.createObject(newLRG);
    this.selectedAllergenId = newId;
  };

  onSelectAllergen = (e: React.ChangeEvent<{ value: unknown }>): void => {
    if (typeof e.target.value === "string")
      this.selectedAllergenId = e.target.value;
  };

  onEnterDinerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let val = e.target.value;
    this.newDinerName = isNaN(Number(val.slice(-1))) ? val : val.slice(0, -1);
  };

  onAddNewDiner = (): void => {
    let lrg = AppRootModelsContext.allergensModel.objectList.find(
      (alrg) => alrg._id === this.selectedAllergenId
    );
    (lrg as Allergens).dinersNameList.push(this.newDinerName);
    AppRootModelsContext.allergensModel.updateItem(lrg as Allergens);
  };

  onSelectAllergenFoodItem = (
    e: React.ChangeEvent<{ value: unknown }>
  ): void => {
    if (typeof e.target.value === "string")
      this.selectedFoodItemId = e.target.value;
  };

  onAddFoodItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    let lrg = AppRootModelsContext.allergensModel.objectList.find(
      (alrg) => alrg._id === this.selectedAllergenId
    );
    (lrg as Allergens).foodItemIdList.push(this.selectedFoodItemId);
    AppRootModelsContext.allergensModel.updateItem(lrg as Allergens);
  };

  render() {
    let lrgDinerList: JSX.Element[] = [];
    let foodItemList: JSX.Element[] = [];
    let lrgFoodList: JSX.Element[] = [];
    let isVisible = false;

    if (this.selectedAllergenId) {
      let selectedLrg = AppRootModelsContext.allergensModel.objectList.find(
        (lrg) => lrg._id === this.selectedAllergenId
      );
      lrgDinerList = (selectedLrg as Allergens).dinersNameList.map((diner) => {
        return (
          <div className="deleteDiners">
            <Typography className="tg" variant="h6" key={diner}>
              {diner}
            </Typography>
            <IconButton
              className="hoverAlertColor"
              onClick={() =>
                (selectedLrg as Allergens).deleteDinerNameFromList(diner)
              }
              size="medium"
            >
              <DeleteForeverIcon
                className="dfi"
                color="secondary"
              ></DeleteForeverIcon>
            </IconButton>
          </div>
        );
      });
      lrgDinerList.unshift(
        <Typography
          variant="h6"
          key={"diner-title"}
          className="title listTitle"
        >
          Diners with {(selectedLrg as Allergens).name} intolerance:
        </Typography>
      );
      foodItemList = AppRootModelsContext.foodItemModel.objectList
        .slice()
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((fi) => (
          <MenuItem key={fi._id} value={fi._id}>
            {fi.name}
          </MenuItem>
        ));
      let lrgFoodIdList = (selectedLrg as Allergens).foodItemIdList.map(
        (lrgFood) => lrgFood
      );
      lrgFoodList = AppRootModelsContext.foodItemModel.objectList
        .filter((f) => lrgFoodIdList.includes(f._id))
        .map((f) => {
          return (
            <div className="deleteItems">
              <Typography className="tg" variant="h6" key={f._id}>
                {f.name}
              </Typography>
              <IconButton
                onClick={() =>
                  (selectedLrg as Allergens).deleteFoodItemFromList(f._id)
                }
                color="secondary"
                size="medium"
              >
                <DeleteForeverIcon
                  className="dfi"
                  fontSize="medium"
                  color="secondary"
                  enableBackground="red"
                ></DeleteForeverIcon>
              </IconButton>
            </div>
          );
        });
      lrgFoodList.unshift(
        <Typography
          variant="h6"
          key={"food-Item-title"}
          className="title listTitle"
        >
          Ingredients with intolerance to {(selectedLrg as Allergens).name}:
        </Typography>
      );
      isVisible = true;
    }

    return (
      <Paper className="paper">
        <div className="coveredData">
          <Box id="mobx-update-date-call" component="span">
            {this.selectedAllergenId}
          </Box>
        </div>
        <div id="mainLrg">
          <Typography id="tgLrgTtl" className="title">
            Allergens
          </Typography>
          <TextField
            label="Enter new intolerance"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.onEnterNewAllergy(e);
            }}
            value={this.allergenName}
            variant="outlined"
            className="txtFld"
          />
          <Fab
            onClick={() => {
              this.onAddNewAllergy();
            }}
            variant="extended"
            color="primary"
            className="addBtn btnShiny"
          >
            <Icon id="icon">add</Icon>Add Intolerance
          </Fab>
          <FormControl variant="outlined" className="selectLrgForm">
            <InputLabel id="selectLbl" variant="outlined">
              Select intolerance
            </InputLabel>
            <Select
              name="select-fi-id"
              value={this.selectedAllergenId}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                this.onSelectAllergen(e)
              }
            >
              {this.allergensList
                .slice()
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((a) => (
                  <MenuItem key={a._id} value={a._id}>
                    {a.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div id="dinersInfo">
          <TextField
            label="Enter diner name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.onEnterDinerName(e);
            }}
            value={this.newDinerName}
            variant="outlined"
            className={`txtFld ${isVisible ? "visible" : "hide"}`}
          />
          <Fab
            onClick={() => {
              this.onAddNewDiner();
            }}
            variant="extended"
            color="primary"
            className={`addBtn btnShiny ${isVisible ? "visible" : "hide"}`}
          >
            <Icon id="icon">add</Icon>Add Diner
          </Fab>
          {lrgDinerList.length > 1 ? lrgDinerList : ""}
        </div>
        <div id="lrgnsIngs">
          <FormControl
            variant="outlined"
            className={`selectIngForm ${isVisible ? "visible" : "hide"}`}
          >
            <InputLabel>Select ingredient</InputLabel>
            <Select
              name="select-fi-id"
              value={this.selectedFoodItemId}
              onChange={(e) => this.onSelectAllergenFoodItem(e)}
            >
              {foodItemList}
            </Select>
          </FormControl>
          <Fab
            onClick={(e) => {
              this.onAddFoodItem(e);
            }}
            variant="extended"
            color="primary"
            className={`addLrgIng btnShiny ${isVisible ? "visible" : "hide"}`}
          >
            <Icon>add</Icon>Add allergen Ingredient
          </Fab>
          {lrgFoodList.length > 1 ? lrgFoodList : ""}
        </div>
      </Paper>
    );
  }
}

export default AllergensComp;
