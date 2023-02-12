import React, { PureComponent } from "react";
import { MealModel, Meal } from "../../models/mealModel";
import MealListItemComp from "./mealListItemComp";
import { observer } from "mobx-react";
import { Grid, Typography, Divider, Fab, Icon } from "@material-ui/core";
import { AppRootModelsContext } from "../../App";
import ObjectID from "bson-objectid";
import { observable } from "mobx";
import "mobx-react-lite/batchingForReactDom";

@observer
class MealListComp extends PureComponent {
  mealModel: MealModel = AppRootModelsContext.mealModel;

  @observable meals: Meal[] = [];

  onAddMeal(date: Date): void {
    let newId = new ObjectID().toHexString();
    let time = new Date(date.setHours(12, 0));
    let newMeal = new Meal(this.mealModel, {
      _id: newId,
      chefId: "",
      date: date,
      name: "Brunch",
      preparing: time,
      serving: time,
    });
    newMeal.store.createObject(newMeal);
  }

  sortedMeals = (mealList: Meal[]): Meal[] => {
    return mealList.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  render() {
    let dates: Set<string> = new Set(
      this.mealModel.objectList
        .slice()
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((m) => m.date.toLocaleDateString())
    );
    let mealsByDates: JSX.Element[] = Array.from(dates).map((date) => {
      let meals: Meal[] = this.mealModel.objectList.filter(
        (m) => m.date.toLocaleDateString() === date
      );
      return (
        <Grid item sm={3} xs={12} key={date}>
          <Typography variant="h6" align={"center"}>
            {meals[0].date.toLocaleDateString()}
          </Typography>
          <Divider />
          {this.sortedMeals(meals).map((m) => {
            return <MealListItemComp meal={m} key={m._id}></MealListItemComp>;
          })}
          <Fab
            variant="extended"
            className="btnShiny"
            color="primary"
            aria-label="add"
            onClick={() => {
              this.onAddMeal(meals[0].date);
            }}
          >
            <Icon>add</Icon>Add meal
          </Fab>
        </Grid>
      );
    });
    return (
      <div>
        <Grid
          spacing={2}
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {mealsByDates}
        </Grid>
      </div>
    );
  }
}
export default MealListComp;
