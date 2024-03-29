import React, { PureComponent, Fragment, forwardRef } from "react";
import MaterialTable from "material-table";
import { FoodItem } from "../../models/foodItemModel";
import { AppRootModelsContext } from "../../App";
import ObjectID from "bson-objectid";
import { observer } from "mobx-react";
import FoodCategoryEnum from "../../enums/foodCategoryEnum";
import UnitEnum from "../../enums/unitEnum";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
import { Autocomplete } from "@material-ui/lab";
import { TextField, IconButton } from "@material-ui/core";
import { observable, computed } from "mobx";
import "./foodItemListStyle.scss";

const FoodItemTag = observer((props: { fi: FoodItem; attr: any }) => (
  <span>{(props.fi as any)[props.attr]}</span>
));

@observer
class FoodItemListComp extends PureComponent {
  @observable filterLitter: string = "All";
  filterOptions: any[] = [
    "All",
    ...Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode("A".charCodeAt(0) + i)
    ),
  ];

  onFilterFoodItems = (selectedVal: string): void => {
    if (selectedVal === null) selectedVal = "All";
    this.filterLitter = selectedVal;
  };

  @computed get filteredData(): FoodItem[] {
    return AppRootModelsContext.foodItemModel.objectList
      .slice()
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .filter((fi) => {
        return this.filterLitter === "All"
          ? true
          : fi.name[0] === this.filterLitter;
      });
  }

  render() {
    return (
      <Fragment>
        <div id="foodItemDiv">
          <MaterialTable
            title="Ingredients"
            icons={{
              Add: forwardRef((props, ref) => (
                <div id="addDiv">
                  <AddIcon
                    id="icon"
                    {...props}
                    ref={ref}
                    color="primary"
                    fontSize="medium"
                    viewBox="0 0 20 20"
                  />
                  <p id="p">Add Food Item</p>
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
                field: "name",
                render: (fi: FoodItem) => <FoodItemTag fi={fi} attr="name" />,
                type: "string" as any,
              },
              {
                title: "Category",
                field: "category",
                lookup: Object.values(FoodCategoryEnum).reduce(
                  (category: any, foodType) => {
                    category[foodType] = foodType;
                    return category;
                  },
                  {}
                ),
                render: (fi: FoodItem) => (
                  <FoodItemTag fi={fi} attr="category" />
                ),
              },
              {
                title: "Base Unit",
                field: "baseUnit",
                lookup: Object.values(UnitEnum).reduce(
                  (unit: any, foodType) => {
                    unit[foodType] = foodType;
                    if (unit[foodType][0] === unit[foodType][0].toLowerCase())
                      unit[foodType] = null;
                    return unit;
                  },
                  {}
                ),
                render: (fi: FoodItem) => (
                  <FoodItemTag fi={fi} attr="baseUnit" />
                ),
                type: "string" as any,
              },
              {
                title: (
                  <Autocomplete
                    id="combo-filter-food-items"
                    options={this.filterOptions}
                    onChange={(event, value) => {
                      this.onFilterFoodItems(value);
                    }}
                    value={this.filterLitter}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by letter"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                ),
                field: "selectSection",
                editable: "never",
              },
            ]}
            data={this.filteredData}
            options={{
              addRowPosition: "first",
              pageSize: AppRootModelsContext.foodItemModel.objectList.length,
              paging: false,
              headerStyle: { position: "sticky", top: 0 },
              maxBodyHeight: "80vh",
              actionsColumnIndex: -1,
              search: false,
            }}
            editable={{
              onRowAdd: (newFI: FoodItem): Promise<void> => {
                return new Promise((res) => {
                  newFI._id = new ObjectID().toHexString();
                  AppRootModelsContext.foodItemModel.createObject(newFI);
                  res();
                });
              },
              onRowUpdate: (newFI: FoodItem, oldFI?: FoodItem) => {
                return new Promise((res, rej) => {
                  if (oldFI) oldFI.store.updateItem(newFI);
                  res(newFI);
                });
              },
              onRowDelete: (oldFI: FoodItem) => {
                return new Promise((res, rej) => {
                  oldFI.isObjDeleted = true;
                  oldFI.store.removeItem(oldFI);
                  res(oldFI);
                });
              },
            }}
          />
        </div>
      </Fragment>
    );
  }
}

export default FoodItemListComp;
