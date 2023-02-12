import React, { PureComponent } from "react";
import { AppRootModelsContext } from "../../../App";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Meal } from "../../../models/mealModel";
import ObjectID from "bson-objectid";
import { Icon, IconButton, Typography, Paper } from "@material-ui/core";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import "./datePickerStyle.scss";

@observer
export default class DatePickerComp extends PureComponent {
  @observable public selectedDay: Date = new Date();

  handleDayChange = (date: Date): void => {
    this.selectedDay = date;
  };

  addNewMealDate = (): void => {
    let newId = new ObjectID().toHexString();
    let newMeal = new Meal(AppRootModelsContext.mealModel, {
      _id: newId,
      chefId: "",
      date: this.selectedDay,
      name: "Brunch",
    });
    newMeal.store.createObject(newMeal);
  };

  render() {
    let currentDate: string = this.selectedDay.toLocaleDateString();
    let mealItems: Meal[] = AppRootModelsContext.mealModel.objectList;
    let dates: Set<string> = new Set(
      mealItems
        .slice()
        .sort((a, b) => a.date.getDate() - b.date.getDate())
        .map((m) => {
          return (
            m.date.toLocaleDateString("en-EN", { weekday: "long" }) +
            " - " +
            m.date.toLocaleDateString()
          );
        })
    );
    let mealDateList: JSX.Element[] = Array.from(dates).map((date) => (
      <Typography variant="h6" key={date}>
        {date}
      </Typography>
    ));

    return (
      <>
        <Paper className="paper">
          <div className="btnAddDate btnShiny">
            <IconButton
              onClick={() => {
                this.addNewMealDate();
              }}
              className="btnIcon"
              size="medium"
            >
              <Icon id="icon">add</Icon>Add Date
            </IconButton>
            <DayPickerInput
              value={currentDate}
              onDayChange={(value) => this.handleDayChange(value)}
              inputProps={{
                style: {
                  marginLeft: 4,
                  width: 150,
                  height: 30,
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bolder",
                },
              }}
            />
          </div>
          <div>
            <Typography variant="h6" className="title">
              Meal Days
            </Typography>
            {mealDateList}
          </div>
        </Paper>
      </>
    );
  }
}
