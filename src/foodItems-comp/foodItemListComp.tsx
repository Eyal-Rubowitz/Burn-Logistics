import React, { PureComponent, Fragment, forwardRef } from "react";
import MaterialTable from "material-table";
import { FoodItem } from "../models/foodItemModel";
import { AppRootModel } from '../modelsContext';
import ObjectID from 'bson-objectid';
import { observer } from 'mobx-react';
import FoodCategoryEnum from "../enums/foodCategoryEnum";
import UnitEnum from "../enums/unitEnum";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from "@material-ui/icons/Add";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { observable, computed } from "mobx";

const theme = createMuiTheme({
    overrides: {
        MuiIconButton: {
            root: {
                '&:hover': {
                    backgroundColor: "black"
                }
            }
        }
    }
})

const FoodItemTag = observer((props: { fi: FoodItem, attr: any }) =>
    <span>{(props.fi as any)[props.attr]}</span>
)

@observer
class FoodItemListComp extends PureComponent {

    @observable filterLitter: string = 'All';
    filterOptions: any[] = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i))];

    onFilterFoodItems = (selectedVal: string): void => {
        if (selectedVal === null) selectedVal = 'All';
        this.filterLitter = selectedVal;
    }

    @computed get filteredData(): FoodItem[] {
        return AppRootModel.foodItemModel.items.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).filter(fi => {
            return ((this.filterLitter === 'All') ? true : fi.name[0] === this.filterLitter)
        });
    }

    render() {
        return (
            <Fragment>
                <div style={{ width: '100%' }}>
                    <MaterialTable
                        title='Ingredients'
                        icons={{
                            Add: forwardRef((props, ref) =>
                                <div style={{ display: 'flex' }}>
                                    <AddIcon
                                        {...props}
                                        ref={ref}
                                        color="primary"
                                        fontSize="default"
                                        viewBox="0 0 20 20" />
                                    <p style={{ fontSize: 14, color: "#3f51b5" }}>
                                        Add Food Item
                                                            </p>
                                </div>),
                            Delete: forwardRef((props, ref) =>
                                <MuiThemeProvider theme={theme}>
                                    <DeleteForeverIcon
                                        {...props}
                                        ref={ref}
                                        color="secondary" />
                                </MuiThemeProvider>)
                        }}
                        columns={[
                            {
                                title: 'Name',
                                field: 'name',
                                render: (fi: FoodItem) => <FoodItemTag fi={fi} attr="name" />,
                                type: "string"
                            },
                            {
                                title: 'Category',
                                field: 'category',
                                lookup: Object.values(FoodCategoryEnum).reduce(
                                    (category: any, foodType) => {
                                        category[foodType] = foodType;
                                        return category
                                    }, {}
                                ),
                                render: (fi: FoodItem) => <FoodItemTag fi={fi} attr="category" />,
                            },
                            {
                                title: 'Base Unit',
                                field: 'baseUnit',
                                lookup: Object.values(UnitEnum).reduce(
                                    (unit: any, foodType) => {
                                        unit[foodType] = foodType;
                                        if (unit[foodType][0] === unit[foodType][0].toLowerCase()) unit[foodType] = null;
                                        return unit
                                    }, {}
                                ),
                                render: (fi: FoodItem) => <FoodItemTag fi={fi} attr="baseUnit" />,
                                type: "string"
                            },
                            {
                                title: <Autocomplete
                                    id="combo-filter-food-items"
                                    options={this.filterOptions}
                                    style={{ width: '100%', display: 'inline-block' }}
                                    onChange={(event, value) => { this.onFilterFoodItems(value) }}
                                    value={this.filterLitter}
                                    renderInput={params => (
                                        <TextField {...params} label="Filter by letter" variant="outlined" fullWidth />
                                    )} />,
                                field: 'selectSection',
                                editable: 'never'
                            }
                        ]}
                        data={this.filteredData}
                        options={{
                            addRowPosition: 'first',
                            pageSize: AppRootModel.foodItemModel.items.length,
                            paging: false,
                            headerStyle: { position: 'sticky', top: 0 },
                            maxBodyHeight: '550px',
                            actionsColumnIndex: -1
                        }}
                        editable={{
                            onRowAdd: (newFI: FoodItem): Promise<void> => {
                                return new Promise((res) => {
                                    console.log('newFI: ', newFI);
                                    newFI._id = (new ObjectID()).toHexString();
                                    AppRootModel.foodItemModel.createItem(newFI);
                                    res();
                                })
                            },
                            onRowUpdate: (newFI: FoodItem, oldFI?: FoodItem) => {
                                return new Promise((res, rej) => {
                                    if (oldFI) oldFI.store.updateItem(newFI);
                                    res();
                                })
                            },
                            onRowDelete: (oldFI: FoodItem) => {
                                return new Promise((res, rej) => {
                                    oldFI.isItemDeleted = true;
                                    oldFI.store.removeItem(oldFI);
                                    res();
                                })
                            }
                        }}
                    />
                </div>
            </Fragment>
        );
    }
}

export default FoodItemListComp;