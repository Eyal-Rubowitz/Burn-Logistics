import React, { PureComponent, Fragment } from "react";
import { Ingredient } from "../../models/ingredientModel";
import { FoodItem } from "../../models/foodItemModel";
import FoodCategoryEnum from "../../enums/foodCategoryEnum";
import UnitEnum from "../../enums/unitEnum";
import { AppRootModelsContext } from "../../App";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import MaterialTable from "material-table";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Typography } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { InventoryItem } from "../../models/inventoryModel";
import "./buyingListStyle.scss";

const IngredientTag = observer(
  (props: { ing: Ingredient; attr: any }): JSX.Element => (
    <span>{(props.ing as any)[props.attr]}</span>
  )
);

const categoryOptions = [
  { label: "All Ingredients", value: null },
  { label: "Purchase Done", value: true },
  { label: "Purchase Needed", value: false },
];

class IngInfo {
  constructor(public delta: number, public fromInventory: number) {
    this.delta = delta % 1 === 0 ? delta : Number(delta.toFixed(3));
  }
}

type IngInfos = Record<string, IngInfo>;

class IngSum {
  constructor(
    public _id: string,
    public dishId: string,
    public foodItemId: string,
    public quantity: number,
    public unit?: UnitEnum
  ) {}
}

// type IType =
//     | "string"
//     | "boolean"
//     | "numeric"
//     | "date"
//     | "datetime"
//     | "time"
//     | "currency";
// const tsType: IType = 'boolean' || 'string';

@observer
class BuyingListComp extends PureComponent {
  @computed get foodItems(): FoodItem[] {
    return AppRootModelsContext.foodItemModel.objectList.map((fi) => fi);
  }

  @computed get chefList(): string[] {
    return AppRootModelsContext.mealModel.objectList.map((m) => m.chefName);
  }

  @computed get filteredData(): Ingredient[] {
    return AppRootModelsContext.ingredientModel.objectList
      .slice()
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .filter((ing) => {
        return (
          (this.chosenCategory === null ||
            ing.category === this.chosenCategory) &&
          (this.chosenFoodItem === null ||
            ing.foodItemId === this.chosenFoodItem) &&
          (this.chosenChef === null || ing.chef === this.chosenChef) &&
          (this.chosenMeal === null || ing.dish.mealId === this.chosenMeal) &&
          (this.chosenBuyingStatus === null ||
            (this.foodInfo[ing._id].delta === 0) === this.chosenBuyingStatus)
        );
      });
  }

  valuateQuantity(inv: InventoryItem): number {
    return inv.unit === "Kg" || inv.unit === "L"
      ? inv.quantity
      : inv.convertedQuantity;
  }

  @computed get foodInfo(): IngInfos {
    let freeInventoryAmount: Record<string, number> =
      AppRootModelsContext.inventoryModel.objectList.reduce((o, item) => {
        if (this.isObjId(item.dishIdOwnedItem)) {
          o[item._id] = this.valuateQuantity(item);
        } else {
          if (o[item.foodItemId] > 0) {
            o[item.foodItemId] += this.valuateQuantity(item);
            o[item._id] = this.valuateQuantity(item);
          } else {
            o[item.foodItemId] = this.valuateQuantity(item);
            o[item._id] = this.valuateQuantity(item);
          }
        }
        return o;
      }, {} as Record<string, number>);

    let ingredients: Ingredient[] = this.chosenSummedIngs
      ? this.accumulateSameItems
      : AppRootModelsContext.ingredientModel.objectList;

    return ingredients.reduce((o: IngInfos, item) => {
      return this.setIngInfo(o, item, freeInventoryAmount);
    }, {});
  }

  setIngInfo(
    o: IngInfos,
    orderedItem: Ingredient,
    freeInvAmount: Record<string, number>
  ) {
    let foodItemId: string = orderedItem.foodItemId;
    let invIdByItem: string = orderedItem.getInvIdByItem;
    let isFreeInv: boolean = !this.isObjId(invIdByItem);
    let initialInv: number =
      freeInvAmount[foodItemId] === undefined
        ? (freeInvAmount[foodItemId] = 0)
        : freeInvAmount[foodItemId];
    initialInv = isFreeInv
      ? freeInvAmount[foodItemId]
      : freeInvAmount[invIdByItem];
    let isCustomUnit: boolean = !(
      orderedItem.unit === "Kg" ||
      orderedItem.unit === "L" ||
      orderedItem.unit === "ml" ||
      orderedItem.unit === "gr"
    )
      ? true
      : false;
    o[orderedItem._id] = new IngInfo(
      Math.max(
        (isCustomUnit ? orderedItem.quantity : orderedItem.convertedQuantity) -
          initialInv,
        0
      ),
      initialInv
    );

    return o;
  }

  checkForHexRegExpObjectID: RegExp = new RegExp("^[0-9a-fA-F]{24}$");
  isObjId(input: string): boolean {
    let bool = this.checkForHexRegExpObjectID.test(input);
    return bool;
  }

  accurateNumber = (itemQuantity: number): number => {
    if (isNaN(itemQuantity)) return NaN;
    return itemQuantity % 1 !== 0
      ? Math.round(parseFloat((itemQuantity * Math.pow(10, 3)).toFixed(3))) /
          Math.pow(10, 3)
      : itemQuantity;
  };

  @computed get accumulateSameItems(): Ingredient[] {
    let foodIdList: string[] = [];
    let sumIngList: Ingredient[] = [];
    let summedItems: Record<string, IngSum> = this.filteredData.reduce(
      (o, ing) => {
        if (
          !this.isObjId(ing.getInvIdByItem) &&
          foodIdList.includes(ing.foodItemId)
        ) {
          o[ing.foodItemId].quantity += ing.convertedQuantity;
        } else {
          let unit: UnitEnum = ing.foodItem
            ? ing.foodItem.baseUnit
            : UnitEnum.Kilogram;
          let sumIng: IngSum = new IngSum(
            ing._id,
            ing.dishId,
            ing.foodItemId,
            ing.convertedQuantity,
            unit
          );
          this.isObjId(ing.getInvIdByItem)
            ? (o[ing._id] = sumIng)
            : (o[ing.foodItemId] = sumIng);
          this.isObjId(ing.getInvIdByItem)
            ? foodIdList.push(ing._id)
            : foodIdList.push(ing.foodItemId);
        }
        return o;
      },
      {} as Record<string, IngSum>
    );
    foodIdList.forEach((foodId) => {
      sumIngList.push(
        new Ingredient(
          AppRootModelsContext.ingredientModel,
          summedItems[foodId]
        )
      );
    });
    return sumIngList;
  }

  // filtering conditions
  @observable chosenFoodItem: string | null = null;
  @observable chosenCategory: string | null = null;
  @observable chosenChef: string | null = null;
  @observable chosenMeal: string | null = null;
  @observable chosenBuyingStatus: boolean | null = null;
  @observable chosenSummedIngs: boolean = false;

  // columns visibility
  @observable revealIsBoughtCol: boolean = true;
  @observable revealChefCol: boolean = true;
  @observable revealAppointedTimeCol: boolean = true;
  @observable revealCategoryCol: boolean = true;
  @observable revealFromInventoryCol: boolean = true;
  @observable revealRequireQuantityCol: boolean = true;
  @observable revealFoobarCol: boolean = true;

  @observable checkedIngs: Ingredient[] = [];
  @observable filteredInvItems: InventoryItem[] = [];

  onSendItemsToInventory = () => {
    let invListToUpdate: InventoryItem[] = [];
    let summedInventory: number = 0;
    let summedIngFoodItemsIdList: Record<string, string> = {};
    let exDate: Date = new Date();
    if (this.chosenSummedIngs) {
      summedIngFoodItemsIdList = this.checkedIngs.reduce((o, ing) => {
        o[ing.foodItemId] = ing.foodItemId;
        return o;
      }, {} as Record<string, string>);
      this.checkedIngs = AppRootModelsContext.ingredientModel.objectList.filter(
        (ing) =>
          ing.foodItemId === summedIngFoodItemsIdList[ing.foodItemId] &&
          ing.getInvIdByItem === ""
      );
      this.filteredInvItems =
        AppRootModelsContext.inventoryModel.objectList.filter(
          (inv) =>
            inv.foodItemId === summedIngFoodItemsIdList[inv.foodItemId] &&
            inv.dishIdOwnedItem === ""
        );
      summedInventory = this.filteredInvItems.reduce(
        (total: number, inv) => total + inv.convertedQuantity,
        0
      );
    }
    invListToUpdate = AppRootModelsContext.inventoryModel.objectList.filter(
      (inv) =>
        inv.foodItemId === summedIngFoodItemsIdList[inv.foodItemId] &&
        inv.dishIdOwnedItem === ""
    );
    invListToUpdate = invListToUpdate
      .slice()
      .sort((a, b) =>
        a.expirationDate === undefined || b.expirationDate === undefined
          ? 1
          : a.expirationDate.getTime() - b.expirationDate.getTime()
      );
    this.checkedIngs.forEach((item) => {
      let invQuantity: number = this.chosenSummedIngs
        ? summedInventory
        : this.foodInfo[item._id].fromInventory;
      let newInvObj = {
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: exDate,
        note: item.note,
        dishIdOwnedItem: item.dishId,
      };
      let newInvItem: InventoryItem = new InventoryItem(
        AppRootModelsContext.inventoryModel,
        newInvObj
      );
      if (invQuantity === 0) {
        AppRootModelsContext.inventoryModel.createObject(newInvItem);
      } else if (invQuantity <= item.convertedQuantity) {
        invListToUpdate.forEach((inv) => {
          invListToUpdate = invListToUpdate.filter(
            (keepInv) => keepInv._id !== inv._id
          );
          if (
            typeof inv.expirationDate === "object" &&
            inv.expirationDate !== exDate
          )
            exDate = inv.expirationDate;
          AppRootModelsContext.inventoryModel.removeItem(inv);
          invQuantity -= inv.convertedQuantity;
        });
        AppRootModelsContext.inventoryModel.createObject(newInvItem);
      } else if (invQuantity > item.convertedQuantity) {
        let ingQuantityToReductionFromInv = item.convertedQuantity;
        invListToUpdate.forEach((inv) => {
          if (ingQuantityToReductionFromInv >= inv.convertedQuantity) {
            ingQuantityToReductionFromInv -= inv.convertedQuantity;
            this.chosenSummedIngs
              ? (summedInventory -= inv.convertedQuantity)
              : (this.foodInfo[item._id].fromInventory -=
                  inv.convertedQuantity);
            invListToUpdate = invListToUpdate.filter(
              (keepInv) => keepInv._id !== inv._id
            );
            if (
              typeof inv.expirationDate === "object" &&
              inv.expirationDate !== exDate
            )
              exDate = inv.expirationDate;
            AppRootModelsContext.inventoryModel.removeItem(inv);
          } else if (
            0 < ingQuantityToReductionFromInv &&
            ingQuantityToReductionFromInv < inv.convertedQuantity
          ) {
            inv.quantity -= ingQuantityToReductionFromInv;
            this.chosenSummedIngs
              ? (summedInventory -= ingQuantityToReductionFromInv)
              : (this.foodInfo[item._id].fromInventory -=
                  inv.convertedQuantity);
            ingQuantityToReductionFromInv = 0;
            AppRootModelsContext.inventoryModel.updateItem(inv);
            if (
              typeof inv.expirationDate === "object" &&
              inv.expirationDate !== exDate
            )
              exDate = inv.expirationDate;
          }
        });
        AppRootModelsContext.inventoryModel.createObject(newInvItem);
      }
    });
    this.checkedIngs = [];
  };

  render() {
    return (
      <Fragment>
        <div id="shoppingDiv">
          <div id="unVisData">
            <Box
              id="mobx-rerender-date-call"
              visibility="hidden"
              component="span"
            >
              {this.foodInfo ? "" : undefined}
              {this.accumulateSameItems ? "" : undefined}
              {this.checkedIngs ? "" : undefined}
              {this.filteredInvItems ? "" : undefined}
            </Box>
          </div>
          <div id="filtersDiv">
            <h2 id="filtersTitle">Filters</h2>
            <div id="combo-box-filters">
              <Autocomplete
                id="combo-box-category"
                options={Object.values(FoodCategoryEnum)}
                className="w"
                onChange={(event, value) => {
                  this.chosenCategory = value;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Autocomplete
                id="combo-box-food-item"
                options={this.foodItems
                  .slice()
                  .sort((a, b) => (a.name > b.name ? 1 : -1))}
                getOptionLabel={(option) => option.name}
                className="w left"
                onChange={(event, value) =>
                  (this.chosenFoodItem = value && value._id)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Food Item"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Autocomplete
                id="combo-box-chef"
                options={this.chefList}
                className="w left"
                onChange={(event, value) => (this.chosenChef = value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chef"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Autocomplete
                id="combo-box-meal"
                options={AppRootModelsContext.mealModel.objectList
                  .slice()
                  .sort((a, b) => a.date.getTime() - b.date.getTime())}
                getOptionLabel={(option) =>
                  `${option.date.toLocaleDateString()} - ${option.categoryType}`
                }
                onChange={(event, value) =>
                  (this.chosenMeal = value && value._id)
                }
                className="w left"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Meal"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Autocomplete
                id="combo-box-status"
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                onChange={(event, value) =>
                  (this.chosenBuyingStatus = value && value.value)
                }
                className="w left"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <FormControlLabel
                id="switchCtrl"
                control={<Switch color="primary" />}
                onChange={(event, value) => (this.chosenSummedIngs = value)}
                label="Sum same items"
                labelPlacement="bottom"
              />
            </div>
          </div>
          <div id="colsReveal">
            <h3 id="colsTitle">Reveal Columns</h3>
            <div id="checkbox-hide-columns">
              <h4 className="checkBox">
                Is Bought
                <Checkbox
                  checked={this.revealIsBoughtCol}
                  onChange={(event, value) => (this.revealIsBoughtCol = value)}
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                Chef
                <Checkbox
                  checked={this.revealChefCol}
                  onChange={(event, value) => (this.revealChefCol = value)}
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                Category
                <Checkbox
                  checked={this.revealCategoryCol}
                  onChange={(event, value) => (this.revealCategoryCol = value)}
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                Appointment Time
                <Checkbox
                  checked={this.revealAppointedTimeCol}
                  onChange={(event, value) =>
                    (this.revealAppointedTimeCol = value)
                  }
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                Current Amount In Inventory
                <Checkbox
                  checked={this.revealFromInventoryCol}
                  onChange={(event, value) =>
                    (this.revealFromInventoryCol = value)
                  }
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                For Purchase
                <Checkbox
                  checked={this.revealRequireQuantityCol}
                  onChange={(event, value) =>
                    (this.revealRequireQuantityCol = value)
                  }
                  color="primary"
                />
              </h4>
              <h4 className="checkBox">
                Base Weight / Volume
                <Checkbox
                  checked={this.revealFoobarCol}
                  onChange={(event, value) => (this.revealFoobarCol = value)}
                  color="primary"
                />
              </h4>
            </div>
          </div>
          <MaterialTable
            title={<h2 id="tableTitle">Shopping List</h2>}
            columns={[
              {
                title: !this.revealIsBoughtCol ? "" : "Is Bought",
                render: (ing: Ingredient) =>
                  !this.revealIsBoughtCol ? null : !this.isObjId(
                      ing.getInvIdByItem
                    ) ? (
                    <Checkbox
                      onChange={(event, value) =>
                        value
                          ? this.checkedIngs.push(ing)
                          : (this.checkedIngs = this.checkedIngs.filter(
                              (i) => i !== ing
                            ))
                      }
                      color="primary"
                      className="unPurchased"
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      color="primary"
                      className="purchased"
                    >
                      Purchase Done
                    </Typography>
                  ),
                type: "boolean" || ("string" as any),
              },
              {
                title: "Ingredient",
                field: "foodItemId",
                render: (ing: Ingredient) => (
                  <IngredientTag ing={ing} attr="name" />
                ),
                type: "string" as any,
              },
              {
                title: !this.revealChefCol ? "" : "Chef",
                field: "foodItemId",
                render: (ing: Ingredient) =>
                  !this.revealChefCol ? null : (
                    <IngredientTag ing={ing} attr="chef" />
                  ),
                type: "string" as any,
              },
              {
                title: !this.revealAppointedTimeCol ? "" : "Appointment Date",
                field: "unit",
                render: (ing: Ingredient) =>
                  !this.revealAppointedTimeCol ? null : ing.appointmentTime,
                type: "string" as any,
              },
              {
                title: !this.revealCategoryCol ? "" : "Category",
                field: "foodItemId",
                render: (ing: Ingredient) =>
                  !this.revealCategoryCol ? null : (
                    <IngredientTag ing={ing} attr="category" />
                  ),
                type: "string" as any,
              },
              {
                title: !this.revealFromInventoryCol
                  ? ""
                  : "Current Amount In Inventory",
                field: "quantity",
                render: (ing: Ingredient) =>
                  !this.revealFromInventoryCol
                    ? null
                    : this.accurateNumber(
                        (this.foodInfo[ing._id] || {}).fromInventory
                      ) + (ing.getItemBaseUnit || " Unit missing"),
                type: "string" as any,
              },
              {
                title: !this.revealRequireQuantityCol ? "" : "For Purchase",
                field: "quantity",
                render: (ing: Ingredient) =>
                  !this.revealRequireQuantityCol
                    ? null
                    : (this.foodInfo[ing._id] || {}).delta +
                      (ing.unit === "gr" || ing.unit === "ml"
                        ? ing.getItemBaseUnit
                        : ing.unit || " Unit missing"),
                type: "string" as any,
              },
              {
                title: !this.revealFoobarCol ? "" : "Base Weight / Volume",
                field: "quantity",
                render: (ing: Ingredient) =>
                  !this.revealFoobarCol
                    ? null
                    : `${ing.convertedQuantity} ${ing.getItemBaseUnit}`,
                type: "string" as any,
              },
            ]}
            data={
              this.chosenSummedIngs
                ? this.accumulateSameItems
                : this.filteredData
            }
            options={{
              pageSize: this.filteredData.length,
              paging: false,
              headerStyle: { position: "sticky", top: 0 },
              maxBodyHeight: "46vh",
              search: false,
            }}
          />
          <div id="btnPurchaseItems">
            <Button
              id="btn"
              variant="outlined"
              color="primary"
              onClick={() => {
                this.onSendItemsToInventory();
              }}
            >
              <Typography variant="h5" id="tg">
                send checked items to inventory
              </Typography>
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default BuyingListComp;
