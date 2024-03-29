import React, { PureComponent, Fragment, forwardRef } from "react";
import MaterialTable from "material-table";
import { InventoryItem } from "../../models/inventoryModel";
import { AppRootModelsContext } from "../../App";
import ObjectID from "bson-objectid";
import { observer } from "mobx-react";
import { Autocomplete } from "@material-ui/lab";
import { FoodItem } from "../../models/foodItemModel";
import { TextField, Button, IconButton } from "@material-ui/core";
import { Ingredient } from "../../models/ingredientModel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
import UnitEnum from "../../enums/unitEnum";
import { Dish } from "../../models/dishModel";
import "./inventoryStyle.scss";

const FoodItemSelection = (props: any): JSX.Element => {
  return (
    <Autocomplete
      id="di"
      clearOnEscape={false}
      options={AppRootModelsContext.foodItemModel.objectList.map((fi) => {
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
      onChange={(e, value: any) => {
        if (!value) return;
        props.onChange(value._id);
      }}
    />
  );
};

// type IDishObj = { _id: string; name: string; };

const DishSelection = (props: any): JSX.Element => {
  let dishes = AppRootModelsContext.dishModel.objectList.map((d) => {
    return { _id: d._id, name: d.name };
    // as IDishObj
  });
  dishes.unshift({ _id: "", name: "Item Is Free" });
  return (
    <Autocomplete
      id="di"
      options={dishes as any}
      getOptionLabel={(option: Dish) => option.name}
      value={AppRootModelsContext.dishModel.objectList.find(
        (d) => d._id === props.value
      )}
      renderInput={(params) => (
        <React.Fragment>
          <TextField {...params} fullWidth />
        </React.Fragment>
      )}
      // onChange={(e, value: { _id: string; name: string; }) => {
      onChange={(e, value: any) => {
        if (!value) return;
        props.onChange(value._id);
      }}
    />
  );
};

const InventoryItemTag = observer((props: { ii: InventoryItem; attr: any }) => (
  <span>{(props.ii as any)[props.attr]}</span>
));

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
        if (typeof value !== "string") return;
        props.onChange(value);
      }}
    />
  );
};

type InventoryProps = { inv: InventoryItem };
type InvDictionary = { [index: string]: InventoryItem };

@observer
class InventoryListComp extends PureComponent<InventoryProps> {
  checkForHexRegExpObjectID: RegExp = new RegExp("^[0-9a-fA-F]{24}$");
  isFreeItem(invItem: InventoryItem): boolean {
    return invItem
      ? !this.checkForHexRegExpObjectID.test(invItem.dishIdOwnedItem)
      : false;
  }

  onMergeSameFreeItems = (): void => {
    let invD: InvDictionary = {};
    AppRootModelsContext.inventoryModel.objectList.forEach((inv) => {
      if (
        invD[inv.foodItemId] !== undefined &&
        this.isFreeItem(invD[inv.foodItemId]) &&
        this.isFreeItem(inv)
      ) {
        let ii: InventoryItem = invD[inv.foodItemId];
        if (ii.unit === inv.unit) {
          invD[inv.foodItemId].quantity += inv.quantity;
          this.mergeUpdate(invD[inv.foodItemId], inv);
        } else if (
          ii.unit !== inv.unit &&
          !this.isCustomUnit(ii.unit) &&
          !this.isCustomUnit(inv.unit)
        ) {
          ii.unit === "gr" || ii.unit === "ml"
            ? this.modifyItem(ii)
            : this.modifyItem(inv);
          invD[inv.foodItemId].quantity += inv.quantity;
          this.mergeUpdate(invD[inv.foodItemId], inv);
        } else {
          invD[inv.foodItemId].quantity += inv.convertedQuantity;
          this.mergeUpdate(invD[inv.foodItemId], inv);
        }
      } else if (!this.isFreeItem(inv)) {
        invD[inv._id] = inv;
      } else {
        invD[inv.foodItemId] = inv;
      }
    });
  };

  mergeUpdate(iiD: InventoryItem, inv: InventoryItem): void {
    iiD.store.updateItem(iiD);
    inv.store.removeItem(inv);
  }

  isCustomUnit(unit: any): boolean {
    return !(unit === "Kg" || unit === "L" || unit === "gr" || unit === "ml")
      ? true
      : false;
  }

  modifyItem(item: InventoryItem): void {
    if (item.unit === "gr") {
      item.unit = UnitEnum.Kilogram;
      item.quantity = item.quantity / 1000;
    } else if (item.unit === "ml") {
      item.unit = UnitEnum.Liter;
      item.quantity = item.quantity / 1000;
    }
  }

  isExDateAlert(time: Date | undefined, now: Date): boolean {
    if (time === undefined) return false;
    return now.getTime() > time.getTime();
  }

  render() {
    let now: Date = new Date();
    return (
      <Fragment>
        <div id="mergeBtnDiv">
          <Button
            variant="outlined"
            color="primary"
            onClick={this.onMergeSameFreeItems}
          >
            merge same free items
          </Button>
        </div>
        <div id="invBody">
          <MaterialTable
            title="Inventory Items"
            icons={{
              Add: forwardRef((props, ref) => (
                <div className="addInvDiv">
                  <AddIcon
                    className="icon"
                    {...props}
                    ref={ref}
                    color="primary"
                    fontSize="medium"
                    viewBox="0 0 20 20"
                  />
                  <p className="p">Add Inventory Item</p>
                </div>
              )),
              Delete: forwardRef((props, ref) => (
                <IconButton className="hoverAlertColor">
                  <DeleteForeverIcon {...props} ref={ref} color="secondary" />
                </IconButton>
              )),
            }}
            columns={[
              {
                title: "Name",
                field: "foodItemId",
                render: (ii: InventoryItem) => (
                  <InventoryItemTag ii={ii} attr="name" />
                ),
                editComponent: FoodItemSelection,
                type: "string" as any,
              },
              {
                title: "Quantity",
                field: "quantity",
                render: (ii: InventoryItem) => (
                  <InventoryItemTag ii={ii} attr="quantity" />
                ),
                type: "numeric",
              },
              {
                title: "Unit",
                field: "unit",
                editComponent: UnitSelection,
                render: (ii: InventoryItem) => (
                  <InventoryItemTag ii={ii} attr="unit" />
                ),
              },
              {
                title: "Belongs To",
                field: "dishIdOwnedItem",
                render: (ii: InventoryItem) => (
                  <InventoryItemTag ii={ii} attr="ownedItemChefName" />
                ),
                editComponent: DishSelection,
              },
              {
                title: "Expiration Date",
                field: "expirationDate",
                render: (ii: InventoryItem) => (
                  <div
                    className={`${
                      this.isExDateAlert(ii.expirationDate, now) ? "ex" : "ok"
                    }`}
                  >
                    <InventoryItemTag ii={ii} attr="toStringDate" />
                  </div>
                ),
                type: "date",
              },
            ]}
            data={AppRootModelsContext.inventoryModel.objectList.map(
              (ii) => ii
            )}
            options={{
              addRowPosition: "first",
              pageSize: AppRootModelsContext.inventoryModel.objectList.length,
              paging: false,
              headerStyle: { position: "sticky", top: 0 },
              maxBodyHeight: "80vh",
              actionsColumnIndex: -1,
              search: false,
            }}
            editable={{
              onRowAdd: (newII: InventoryItem): Promise<void> => {
                return new Promise((res) => {
                  newII._id = new ObjectID().toHexString();
                  newII.expirationDate = new Date();
                  newII.note = "";
                  AppRootModelsContext.inventoryModel.createObject(newII);
                  res();
                });
              },
              onRowUpdate: (newII: InventoryItem, oldII?: InventoryItem) => {
                return new Promise((res, rej) => {
                  if (oldII) oldII.store.updateItem(newII);
                  window.location.reload();
                  res(newII);
                });
              },
              onRowDelete: (oldII: InventoryItem) => {
                return new Promise((res, rej) => {
                  oldII.isObjDeleted = true;
                  oldII.store.removeItem(oldII);
                  res(oldII);
                });
              },
            }}
          />
        </div>
      </Fragment>
    );
  }
}

export default InventoryListComp;
