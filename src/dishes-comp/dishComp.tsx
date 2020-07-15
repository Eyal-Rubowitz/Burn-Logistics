import React, { PureComponent, forwardRef, Fragment } from 'react';
import { Dish } from '../models/dishModel';
import { FoodItem } from '../models/foodItemModel';
import { Ingredient } from '../models/ingredientModel';
import { AppRootModel } from '../modelsContext';
import { observer } from 'mobx-react';
import { IReactionDisposer, autorun, observable } from 'mobx';
import MaterialTable from "material-table";
import {
    TextField, IconButton, ExpansionPanel,
    ExpansionPanelSummary, ExpansionPanelDetails,
    Typography, Box, Fab
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ObjectID from 'bson-objectid';
import AddIcon from "@material-ui/icons/Add";
import { Allergans } from '../models/allergensModel';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiIconButton: {
            colorSecondary: {
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.08)'
                }
            }
        }
    }
})

const IngredientTag = observer((props: { ing: Ingredient, attr: any }) =>
    <span>{(props.ing as any)[props.attr]}</span>
)

const FoodItemSelection = (props: any): JSX.Element => {
    return (
        <Autocomplete
            id='di'
            options={AppRootModel.foodItemModel.items.slice().sort((a, b) => (a.name > b.name) ? 1 : -1).map(fi => {
                return { _id: fi._id, name: fi.name }
            })}
            getOptionLabel={(option: FoodItem) => option.name}
            value={AppRootModel.foodItemModel.items.find((i) => i._id === props.value)}
            renderInput={params => (
                <React.Fragment>
                    <TextField {...params}
                        fullWidth />
                </React.Fragment>
            )}
            onChange={(e, value) => {
                props.onChange(value._id)
            }} />
    )
}

const UnitSelection = (props: any): JSX.Element => {
    return (
        <Autocomplete
            id='fi'
            options={((new Ingredient(AppRootModel.ingredientModel, props.rowData)).foodItem || { foodUnits: ["foobar"] }).foodUnits}
            renderInput={params => (
                <React.Fragment>
                    <TextField {...params}
                        fullWidth />
                </React.Fragment>
            )}
            value={props.value}
            onChange={(e, value) => {
                props.onChange(value)
            }} />
    )
}

type DishProps = { dish: Dish };

@observer
class DishComp extends PureComponent<DishProps> {

    disposeAutorun: IReactionDisposer;
    @observable dish?: Dish;
    @observable lrgns: Allergans[] = [];

    constructor(props: DishProps) {

        super(props);
        // why use derivetion of autorun and not computed?..
        // autorun, runs the reaction immediately 
        // and also on any change in the observables
        // used inside function !
        this.disposeAutorun = autorun(() => {
            let dishId = this.props.dish._id;
            this.dish = AppRootModel.dishModel.items.find((d: Dish) => d._id === dishId);
            this.lrgns = AppRootModel.allergensModel.items.map(lrg => lrg);
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
    }

    onDelete = (): void => {
        this.props.dish.isItemDeleted = true;
        this.props.dish.store.removeItem(this.props.dish);
    }

    render() {
        let lrg: number = this.lrgns.length;
        return (
            <Fragment>
                <div style={{ height: "0px" }}>
                    <Box id="mobx-update-date-call"
                        visibility="hidden"
                        component="span">
                        {lrg}
                    </Box>
                </div>
                {this.dish && <ExpansionPanel key={this.props.dish._id}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <TextField value={this.props.dish.name}
                            name='name'
                            onChange={this.onHandleChefNameChange} />
                        <MuiThemeProvider theme={theme}>
                            <IconButton onClick={this.onDelete} color="secondary" size="medium" >
                                <DeleteForeverIcon fontSize="large"></DeleteForeverIcon>
                            </IconButton>
                        </MuiThemeProvider>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div style={{ width: '100%' }}>
                            <MaterialTable
                                title='Ingrediants'
                                icons={{
                                    Add: forwardRef((props, ref) => <div style={{ display: 'flex' }}><AddIcon {...props} ref={ref} color="primary" fontSize="default" viewBox="0 0 20 20" /><p style={{ fontSize: 14, color: "#3f51b5" }}>Add Ingredient</p></div>),
                                }}
                                columns={[
                                    {
                                        title: 'Name',
                                        field: 'foodItemId',
                                        render: (ing: Ingredient) => <IngredientTag ing={ing} attr="name" />,
                                        editComponent: FoodItemSelection,
                                        type: "string"
                                    },
                                    {
                                        title: 'Quantity',
                                        field: 'quantity',
                                        render: (ing: Ingredient) => <IngredientTag ing={ing} attr="quantity" />,
                                        type: 'numeric',
                                    },
                                    {
                                        title: 'Unit',
                                        field: 'unit',
                                        editComponent: UnitSelection,
                                        render: (ing: Ingredient) => <IngredientTag ing={ing} attr="unit" />,
                                        type: 'string'
                                    },
                                    {
                                        title: 'Intolerance',
                                        render: (ing: Ingredient) => {
                                            let intolerance = (ing) ? this.lrgns.find(lrg => lrg.foodItemIdList.includes(ing.foodItemId)) : undefined;
                                            let diners = (intolerance) ? intolerance.dinersNameList.map(d => <Typography variant="subtitle1">{d}</Typography>) : '';
                                            return (
                                                (intolerance) ?
                                                    <ExpansionPanel key={'info'} style={{ width: '250px', color: 'red', fontSize: 16, fontWeight: 'bold' }}>
                                                        <ExpansionPanelSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header">
                                                            Intolerance alert
                                                    </ExpansionPanelSummary>
                                                        <Typography variant="h6">Diners with intolerance to {intolerance.name} are: {diners}</Typography>
                                                    </ExpansionPanel> : <div style={{ color: 'green', fontWeight: 'bold' }}>Intolerance free</div>
                                            )
                                        },
                                    },
                                    {
                                        title: 'Cost',
                                        field: 'cost',
                                        render: (ing: Ingredient) => <IngredientTag ing={ing} attr="cost" />,
                                        type: 'numeric'
                                    },
                                    {
                                        title: 'Note',
                                        field: 'note',
                                        render: (ing: Ingredient) => {
                                            return (
                                                (ing) ?
                                                    <div>
                                                        <Router>
                                                            <Fab color="primary" variant="extended" onClick={() => window.location.reload(false)}>
                                                                <NavLink activeStyle={{ textDecoration: "underline" }} style={{ textDecoration: 'none', color: 'white' }} to={`/meals/${ing.dishId}/ingredient-note/${ing._id}`}>
                                                                    Edit Item Note
                                                            </NavLink>
                                                            </Fab>
                                                        </Router>
                                                    </div> : ""
                                            )
                                        },
                                        editable: 'never'
                                    }
                                ]}
                                data={this.props.dish.ingrediants}
                                options={{
                                    addRowPosition: 'first',
                                    actionsColumnIndex: -1
                                }}
                                editable={{
                                    onRowAdd: (newIng: Ingredient): Promise<void> => {
                                        return new Promise((res) => {
                                            let ingIndex = this.props.dish.ingrediants.findIndex(ing => ing.foodItemId === newIng.foodItemId);
                                            if (this.dish && ingIndex < 0) {
                                                newIng._id = (new ObjectID()).toHexString();
                                                newIng.dishId = this.props.dish._id;
                                                newIng.note = '';
                                                this.props.dish.store.root.ingredientModel.createItem(newIng);
                                            }
                                            res();
                                        })
                                    },
                                    onRowUpdate: (newIng: Ingredient, oldIng?: Ingredient) => {
                                        return new Promise((res, rej) => {
                                            if (oldIng) {
                                                oldIng.store.updateItem(newIng);
                                            }
                                            res();
                                        })
                                    },
                                    onRowDelete: (oldIng: Ingredient) => {
                                        return new Promise((res, rej) => {
                                            oldIng.isItemDeleted = true;
                                            oldIng.store.removeItem(oldIng);
                                            res();
                                        })
                                    }
                                }} />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>}
            </ Fragment>
        );
    }
}

export default DishComp;