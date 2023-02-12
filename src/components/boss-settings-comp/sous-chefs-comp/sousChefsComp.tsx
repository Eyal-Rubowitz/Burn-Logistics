import React, { PureComponent, Fragment } from "react";
import {
  Paper,
  Typography,
  Fab,
  Icon,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { observer } from "mobx-react";
import { observable, computed, IReactionDisposer, autorun } from "mobx";
import { Meal } from "../../../models/mealModel";
import { AppRootModelsContext } from "../../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SelectedMealStore from "../../../stores/SelectedMealStore";
import MealSelectComp from "../meal-select-comp/mealSelectComp";
import "./sousChefsStyle.scss";

type IMealProps = { meal: Meal };

@observer
class SousChefsComp extends PureComponent {
  disposeAutorun: IReactionDisposer;

  selectedMealStore = new SelectedMealStore();

  @observable sousChefId: string = "";

  constructor(props: IMealProps) {
    super(props);
    this.disposeAutorun = autorun(() => {
      let dates: Set<string> = new Set(
        this.meals.map((m) => m.date.toLocaleDateString())
      );
      this.selectedMealStore.dateList = dates
        ? [...Array.from(dates).map((date) => date)]
        : [];
    });
  }

  componentWillUnmount(): void {
    this.disposeAutorun();
  }

  @computed get meals(): Meal[] {
    return AppRootModelsContext.mealModel.objectList.map((m) => m);
  }

  @computed get meal(): Meal | undefined {
    return this.selectedMealStore.meal;
  }

  mealInfo(): string {
    let info = "";
    if (this.meal)
      info = `${this.meal.chefName} - ${this.meal.date.toLocaleDateString(
        "en-EN",
        { weekday: "long" }
      )} ${this.meal.date.toLocaleDateString()}`;
    return info;
  }

  onEnterSousChefId(e: React.ChangeEvent<any>): void {
    this.sousChefId = e.target.value;
  }

  onAddNewSousChef(): void {
    if (this.meal) {
      let isAlreadyInList = this.meal.sousChefIdList.some(
        (mmbrId) => mmbrId === this.sousChefId
      );
      if (!isAlreadyInList) {
        this.meal.sousChefIdList.push(this.sousChefId);
        AppRootModelsContext.mealModel.updateItem(this.meal);
        this.sousChefId = "";
      } else {
        alert("member is already in position!");
      }
    }
  }

  getKitchenCrew(): JSX.Element[] {
    let team: string[] = [];
    if (this.meal) {
      team = this.meal.sousChefIdList;
    }
    let members: Record<string, string> = this.meal
      ? this.meal.memberListData
      : {};

    let crew: JSX.Element[] = team.map((mmbrId) => {
      return (
        <div>
          <Typography variant="h6" key={mmbrId} className="tgCrewMmbr">
            {members[mmbrId]}
          </Typography>
          <IconButton
            className="hoverAlertColor"
            onClick={() => (this.meal as Meal).deleteSousChefFromList(mmbrId)}
            color="secondary"
            size="medium"
          >
            <DeleteForeverIcon
              className="tgCrewMmbr"
              fontSize="medium"
              color="secondary"
              enableBackground="red"
            ></DeleteForeverIcon>
          </IconButton>
        </div>
      );
    });

    return crew;
  }

  render() {
    let members: Record<string, string> = this.meal?.memberListData || {};
    let memberList: JSX.Element[] = Object.keys(members).map((mmbrId) =>
      this.meal?.chefId !== mmbrId ? (
        <MenuItem key={mmbrId} value={mmbrId}>
          {this.meal?.sousChefIdList.includes(mmbrId)
            ? members[mmbrId] + " 😇"
            : members[mmbrId]}
        </MenuItem>
      ) : (
        <></>
      )
    );
    return (
      <Fragment>
        <Paper className="paper">
          <MealSelectComp store={this.selectedMealStore} />
          <div className={`${this.meal !== undefined ? "visible" : "hide"}`}>
            <Typography variant="h4" className="tgMealInfo">
              {this.mealInfo()}
            </Typography>
            <InputLabel id="sous-label">Select sous chef</InputLabel>
            <Select
              labelId="sous-label"
              value={this.sousChefId}
              name="sousChefId"
              className="txtFldSousInput"
              onChange={(e: React.ChangeEvent<any>) => {
                this.onEnterSousChefId(e);
              }}
            >
              {memberList}
            </Select>
            <Fab
              onClick={() => {
                this.onAddNewSousChef();
              }}
              variant="extended"
              color="primary"
              className="btnAddSous btnShiny"
            >
              <Icon id="icon">add</Icon>Assign to shift
            </Fab>
            <Typography variant="h5" className="sousTtl">
              Sous Chef Crew
            </Typography>
            <Typography variant="h6">{this.getKitchenCrew()}</Typography>
          </div>
        </Paper>
      </Fragment>
    );
  }
}

export default SousChefsComp;
