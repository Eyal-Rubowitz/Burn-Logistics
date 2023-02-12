import React, { PureComponent, Fragment } from "react";
import {
  Paper,
  Typography,
  Fab,
  Icon,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { observer } from "mobx-react";
import { observable, computed, IReactionDisposer, autorun } from "mobx";
import { Meal } from "../../../models/mealModel";
import { AppRootModelsContext } from "../../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SelectedMealStore from "../../../stores/SelectedMealStore";
import MealSelectComp from "../meal-select-comp/mealSelectComp";
import "./cleaningCrewStyle.scss";

@observer
class CleaningCrewComp extends PureComponent {
  disposeAutorun: IReactionDisposer;

  @observable cleaningMemberId: string = "";
  @observable selectedMealStore = new SelectedMealStore();

  constructor(props: {}) {
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

  onSelectCleaningMember(e: React.ChangeEvent<any>): void {
    this.cleaningMemberId = e.target.value;
  }

  onAddNewCleaningMember(): void {
    if (this.meal) {
      let isAlreadyInList = this.meal.cleaningCrewIdList.some(
        (mmbrId) => mmbrId === this.cleaningMemberId
      );
      if (!isAlreadyInList) {
        this.meal.cleaningCrewIdList.push(this.cleaningMemberId);
        AppRootModelsContext.mealModel.updateItem(this.meal);
        this.cleaningMemberId = "";
      } else {
        alert("member is already in position!");
      }
    }
  }

  getKitchenCrew(): JSX.Element[] {
    let cleaningTeamId: string[] = [];
    if (this.meal) {
      cleaningTeamId = this.meal.cleaningCrewIdList;
    }

    let members: Record<string, string> = this.meal
      ? this.meal.memberListData
      : {};

    let crew: JSX.Element[] = cleaningTeamId.map((cleanerId) => {
      return (
        <div>
          <Typography variant="h6" key={cleanerId} className="tgCrewMmbr">
            {members[cleanerId]}
          </Typography>
          <IconButton
            className="hoverAlertColor"
            onClick={() =>
              (this.meal as Meal).deleteCleaningMemberFromList(cleanerId)
            }
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
            <Typography variant="h4" className="cleaningTitle">
              {this.mealInfo()}
            </Typography>
            {/* <TextField label="Enter cleaning member"
                            onChange={(e: React.ChangeEvent<any>) => { this.onEnterCleaningMemberName(e) }}
                            value={this.cleaningMemberName}
                            variant="outlined"/> */}
            <InputLabel id="sous-label">Select cleaning member</InputLabel>
            <Select
              labelId="sous-label"
              value={this.cleaningMemberId}
              name="sousChefId"
              className="txtFldSousInput"
              onChange={(e: React.ChangeEvent<any>) => {
                this.onSelectCleaningMember(e);
              }}
            >
              {memberList}
            </Select>
            <Fab
              onClick={() => {
                this.onAddNewCleaningMember();
              }}
              variant="extended"
              color="primary"
              className="addClnMmbr btnShiny"
            >
              <Icon id="icon">add</Icon>Assign to shift
            </Fab>
            <Typography variant="h5" id="tgClnTitle">
              Cleaning Crew
            </Typography>
            <Typography variant="h6">{this.getKitchenCrew()}</Typography>
          </div>
        </Paper>
      </Fragment>
    );
  }
}

export default CleaningCrewComp;
