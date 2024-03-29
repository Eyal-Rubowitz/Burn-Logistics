import React, { PureComponent, forwardRef, Fragment } from "react";
import { Dish } from "../../models/dishModel";
import { FoodItem } from "../../models/foodItemModel";
import { Ingredient } from "../../models/ingredientModel";
import { AppRootModelsContext } from "../../App";
import { observer } from "mobx-react";
import { IReactionDisposer, autorun, observable } from "mobx";
import MaterialTable from "material-table";
import {
  TextField,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Box,
  Fab,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Autocomplete } from "@material-ui/lab";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ObjectID from "bson-objectid";
import AddIcon from "@material-ui/icons/Add";
import { Allergens } from "../../models/allergensModel";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import "./dishStyle.scss";

const IngredientTag = observer((props: { ing: Ingredient; attr: any }) => (
  <span>{(props.ing as any)[props.attr]}</span>
));

const FoodItemSelection = (props: any): JSX.Element => {
  return (
    <Autocomplete
      id="di"
      options={AppRootModelsContext.foodItemModel.objectList
        .slice()
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((fi) => {
          return { _id: fi._id, name: fi.name } as any;
        })}
      getOptionLabel={(option: FoodItem) => option.name}
      value={AppRootModelsContext.foodItemModel.objectList.find(
        (i) => i._id === props.value
      )}
      renderInput={(params) => (
        <React.Fragment>
          <TextField {...params} fullWidth />
        </React.Fragment>
      )}
      onChange={(e, value) => {
        props.onChange(value?._id);
      }}
    />
  );
};

const UnitSelection = (props: any): JSX.Element => {
  return (
    <Autocomplete
      id="fi"
      options={
        (
          new Ingredient(AppRootModelsContext.ingredientModel, props.rowData)
            .foodItem || { foodUnits: ["foobar"] }
        ).foodUnits
      }
      renderInput={(params) => (
        <React.Fragment>
          <TextField {...params} fullWidth />
        </React.Fragment>
      )}
      value={props.value}
      onChange={(e, value) => {
        props.onChange(value);
      }}
    />
  );
};

type IDishProps = { dish: Dish };

@observer
class DishComp extends PureComponent<IDishProps> {
  disposeAutorun: IReactionDisposer;
  @observable dish?: Dish;
  @observable lrgns: Allergens[] = [];

  constructor(props: IDishProps) {
    super(props);
    // why use derivation of autorun and not computed?..
    // autorun, runs the reaction immediately
    // and also on any change in the observables
    // used inside function !
    this.disposeAutorun = autorun(() => {
      const dishId = this.props.dish._id;
      this.dish = AppRootModelsContext.dishModel.objectList.find(
        (d: Dish) => d._id === dishId
      );
      this.lrgns = AppRootModelsContext.allergensModel.objectList.map(
        (lrg) => lrg
      );
    });
  }

  componentWillUnmount() {
    this.disposeAutorun();
  }

  onHandleChefNameChange = (e: React.ChangeEvent<any>): void => {
    let name: string = e.target.name;
    let value: string = e.target.value;
    (this.props.dish as any)[name] = value;
    this.props.dish.store.updateItem(this.props.dish);
  };

  onDelete = (): void => {
    this.props.dish.isObjDeleted = true;
    this.props.dish.store.removeItem(this.props.dish);
  };

  render() {
    let lrg: number = this.lrgns.length;
    return (
      <Fragment>
        <div id="unVisLrgDiv">
          <Box id="mobx-update-date-call" visibility="hidden" component="span">
            {lrg}
          </Box>
        </div>
        {this.dish && (
          <ExpansionPanel key={this.props.dish._id}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <TextField
                value={this.props.dish.name}
                name="name"
                onChange={this.onHandleChefNameChange}
              />
              <IconButton
                onClick={this.onDelete}
                color="secondary"
                size="medium"
                className="hoverAlertColor"
              >
                <DeleteForeverIcon fontSize="large" />
              </IconButton>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="ingTable">
                <MaterialTable
                  title="Ingredients"
                  icons={{
                    Add: forwardRef((props, ref) => (
                      <div className="addIngDiv">
                        <AddIcon
                          {...props}
                          ref={ref}
                          className="icon"
                          color="primary"
                          viewBox="0 0 20 20"
                        />
                        <p className="p">Add Ingredient</p>
                      </div>
                    )),
                    Delete: forwardRef((props, ref) => (
                      <IconButton size="medium" className="hoverAlertColor">
                        <DeleteForeverIcon
                          {...props}
                          ref={ref}
                          color="secondary"
                        />
                      </IconButton>
                    )),
                  }}
                  columns={[
                    {
                      title: "Name",
                      field: "foodItemId",
                      render: (ing: Ingredient) => (
                        <IngredientTag ing={ing} attr="name" />
                      ),
                      editComponent: FoodItemSelection,
                      type: "string" as any,
                    },
                    {
                      title: "Quantity",
                      field: "quantity",
                      render: (ing: Ingredient) => (
                        <IngredientTag ing={ing} attr="quantity" />
                      ),
                      type: "numeric" as any,
                    },
                    {
                      title: "Unit",
                      field: "unit",
                      editComponent: UnitSelection,
                      render: (ing: Ingredient) => (
                        <IngredientTag ing={ing} attr="unit" />
                      ),
                      type: "string" as any,
                    },
                    {
                      title: "Intolerance",
                      render: (ing: Ingredient) => {
                        let intolerance = ing
                          ? this.lrgns.find((lrg) =>
                              lrg.foodItemIdList.includes(ing.foodItemId)
                            )
                          : undefined;
                        let diners = intolerance
                          ? intolerance.dinersNameList.map((d) => (
                              <Typography variant="subtitle1">{d}</Typography>
                            ))
                          : "";
                        return intolerance ? (
                          <ExpansionPanel key={"info"} className="lrgAlert">
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              Intolerance alert
                            </ExpansionPanelSummary>
                            <Typography variant="h6">
                              Diners with intolerance to {intolerance.name} are:{" "}
                              {diners}
                            </Typography>
                          </ExpansionPanel>
                        ) : (
                          <div className="lrgFree">Intolerance free</div>
                        );
                      },
                    },
                    {
                      title: "Cost",
                      field: "cost",
                      render: (ing: Ingredient) => (
                        <IngredientTag ing={ing} attr="cost" />
                      ),
                      type: "numeric",
                    },
                    {
                      title: "Note",
                      field: "note",
                      render: (ing: Ingredient) => {
                        return ing ? (
                          <div>
                            <Router>
                              <Fab
                                color="primary"
                                variant="extended"
                                onClick={() => window.location.reload()}
                              >
                                <NavLink
                                  className="noteNav btnShiny"
                                  to={`/meals/${ing.dishId}/ingredient-note/${ing._id}`}
                                >
                                  Edit Item Note
                                </NavLink>
                              </Fab>
                            </Router>
                          </div>
                        ) : (
                          ""
                        );
                      },
                      editable: "never",
                    },
                  ]}
                  data={this.props.dish.ingredients}
                  options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                  }}
                  editable={{
                    onRowAdd: (newIng: Ingredient): Promise<void> => {
                      return new Promise((res) => {
                        let ingIndex = this.props.dish.ingredients.findIndex(
                          (ing) => ing.foodItemId === newIng.foodItemId
                        );
                        if (this.dish && ingIndex < 0) {
                          newIng._id = new ObjectID().toHexString();
                          newIng.dishId = this.props.dish._id;
                          newIng.note = "";
                          this.props.dish.store.root.ingredientModel.createObject(
                            newIng
                          );
                        }
                        res();
                      });
                    },
                    onRowUpdate: (newIng: Ingredient, oldIng?: Ingredient) => {
                      return new Promise((res, rej) => {
                        if (oldIng) {
                          oldIng.store.updateItem(newIng);
                        }
                        res(newIng);
                      });
                    },
                    onRowDelete: (oldIng: Ingredient) => {
                      return new Promise((res, rej) => {
                        oldIng.isObjDeleted = true;
                        oldIng.store.removeItem(oldIng);
                        res(oldIng);
                      });
                    },
                  }}
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
      </Fragment>
    );
  }
}

export default DishComp;
