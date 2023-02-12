import React, { PureComponent } from "react";
import { Ingredient } from "../../../models/ingredientModel";
import { Fab, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { IReactionDisposer, autorun, observable } from "mobx";
import { createBrowserHistory } from "history";
import { AppRootModelsContext } from "../../../App";
import { Dish } from "../../../models/dishModel";
import { Meal } from "../../../models/mealModel";
import "./ingredientNoteStyle.scss";

type IngCompProps = {
  match: { params: { id: string }; url: string; path: string };
};

@observer
class IngredientNoteComp extends PureComponent<IngCompProps> {
  history = createBrowserHistory();
  disposeAutorun: IReactionDisposer;
  @observable ingredient?: Ingredient;
  @observable dish?: Dish;
  @observable meal?: Meal;
  @observable noteText: string = "";

  constructor(props: IngCompProps) {
    super(props);
    // why use derivation of autorun and not computed?..
    // autorun, runs the reaction immediately
    // and also on any change
    // in the observables used inside function !
    this.disposeAutorun = autorun(() => {
      let ingId = this.props.match.params.id;
      this.ingredient = AppRootModelsContext.ingredientModel.objectList.find(
        (ingr: Ingredient) => ingr._id === ingId
      );
      this.dish = AppRootModelsContext.dishModel.objectList.find(
        (d) => d._id === (this.ingredient as Ingredient).dishId
      );
      this.meal = AppRootModelsContext.mealModel.objectList.find(
        (m) => m._id === (this.dish as Dish).mealId
      );
      this.noteText = (this.ingredient as Ingredient).note;
    });
  }

  componentWillUnmount() {
    this.disposeAutorun();
  }

  onTextChange = (e: React.ChangeEvent<any>): void => {
    this.noteText = e.target.value;
  };

  onSaveText = (): void => {
    if (this.ingredient) {
      this.ingredient.note = this.noteText;
      AppRootModelsContext.ingredientModel.updateItem(this.ingredient);
    }
  };

  render() {
    let chefName: string = "";
    let day: string = "";
    let mealName: string = "";
    let ingName: string = "";
    if (this.ingredient && this.meal && this.meal) {
      ingName = this.ingredient.name;
      day = this.meal.date.toLocaleDateString("en-EN", { weekday: "long" });
      mealName = this.meal.categoryType;
      chefName = this.meal.chefName;
    }
    return (
      <div id="noteDiv">
        <Fab
          id="returnBtn"
          onClick={() => {
            this.history.goBack();
          }}
          variant="extended"
          className="btnShiny"
          color="primary"
        >
          <Typography variant="h6">&#x1f844; Back</Typography>
        </Fab>
        <Typography variant="h5" id="tgIngTitleData">
          {chefName}'s - {day} {mealName} - {ingName}
        </Typography>
        <textarea
          id="ingNote"
          value={this.noteText}
          placeholder="Enter Ingredient's Note"
          onChange={(e) => this.onTextChange(e)}
        ></textarea>
        <Fab
          id="saveBtn"
          onClick={() => {
            this.onSaveText();
          }}
          variant="extended"
          className="btnShiny"
          color="primary"
        >
          <Typography variant="h6">Save Text Changes</Typography>
        </Fab>
      </div>
    );
  }
}

export default IngredientNoteComp;
