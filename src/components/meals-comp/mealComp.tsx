import React, { PureComponent, Fragment } from 'react';
import { Meal } from '../../models/mealModel';
import { Dish } from '../../models/dishModel';
import DishComp from '../dishes-comp/dishComp';
import { AppRootModel } from '../../modelsContext';
import { IReactionDisposer, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Typography, Fab, Icon, Box, ExpansionPanel, ExpansionPanelSummary, TextField } from '@material-ui/core';
import ObjectID from 'bson-objectid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Ingredient } from '../../models/ingredientModel';
import './meals-style/mealStyle.scss';

type MealCompProps = { match: { params: { id: string }, url: string, path: string } };

@observer
class MealComp extends PureComponent<MealCompProps> {
    disposeAutorun: IReactionDisposer;
    @observable meal?: Meal;
    @observable mealQuantity: Number = 0;
    @observable mealExpenses: Number = 0;
    @observable preparing: Date = new Date();
    @observable serving: Date = new Date();

    constructor(props: MealCompProps) {
        super(props);
        // why use derivetion of autorun and not computed?..
        // autorun - Runs the reaction immediately 
        // and also on any change 
        // in the observables used inside function !
        this.disposeAutorun = autorun(() => {
            let mealId: string = this.props.match.params.id;
            this.meal = AppRootModel.mealModel.items.find((m: Meal) => m._id === mealId);
            let mealIngs: Ingredient[] = [];
            if (this.meal) {
                mealIngs = Array.prototype.concat.apply([], this.meal.dishes.map(d => d.ingrediants.map(ing => ing)));
                this.mealQuantity = mealIngs.reduce((mealCost: number, ing) => { return mealCost + ((ing.getItemBaseUnit === 'Kg') ? ing.convertedQuantity : 0) }, 0);
                this.mealExpenses = AppRootModel.ingredientModel.items.reduce((mealCost: number, ing) => { return mealCost + ing.cost }, 0);
                this.preparing = (this.meal as Meal).preparing;
                this.serving = (this.meal as Meal).serving;
            }
        });
    }

    componentWillUnmount() {
        this.disposeAutorun();
    }

    toMomentString(time: Date): string {
        let timeH: number = time.getHours();
        let timeM: number = time.getMinutes();
        let zeroH: string = timeH <= 9 ? "0" : "";
        let zeroM: string = timeM <= 9 ? "0" : "";
        return `${zeroH}${timeH}:${zeroM}${timeM}`;
    }

    onAddDish(): void {
        if (this.meal) {
            let newId: string = (new ObjectID()).toHexString()
            let newDish: Dish = new Dish(AppRootModel.dishModel, { _id: newId, name: 'New Dish', mealId: this.meal._id });
            AppRootModel.dishModel.createItem(newDish);
        }
    }

    onUpdateTime(e: React.ChangeEvent<any>): void {
        let focusId: string = e.target.id;
        let inputTime: string = e.target.value;
        let hour: number = 0;
        let min: number = 0;
        hour = Number(inputTime.slice(0, 2));
        min = Number(inputTime.slice(-2));
        if (this.meal) {
            (focusId === 'preparing') ? this.preparing = new Date(this.meal.preparing.setHours((hour), min)) : this.serving = new Date(this.meal.serving.setHours((hour), min));
            (focusId === 'preparing') ? this.meal.preparing = this.preparing : this.meal.serving = this.serving;
            AppRootModel.mealModel.updateItem(this.meal);
        }
    }

    render() {
        return (
            <div>
                {this.meal && <Fragment>
                    <Typography variant='h6' align={'center'}>
                        {this.meal.chef}
                    </Typography>
                    <Typography variant='h6' align={'center'}>
                        {this.meal.date.toLocaleDateString('en-EN', { weekday: 'long' })} {this.meal.name} - {this.meal.date.toLocaleDateString()}
                    </Typography>
                    <div className="mealDataDiv1">
                        <TextField label="👨‍🍳Preparations start at"
                            id="txtFldPreparing"
                            type="time"
                            value={this.toMomentString(this.preparing)}
                            onChange={(e) => this.onUpdateTime(e)}
                            variant="outlined"
                            inputProps={{
                                style: { width: '180px', textAlign: 'center', fontWeight: 'bolder' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: 18, fontWeight: 'bolder' }
                            }} />
                        <TextField label="😋Dining serving time"
                            id="txtFldServing"
                            type="time"
                            value={this.toMomentString(this.serving)}
                            onChange={(e) => this.onUpdateTime(e)}
                            variant="outlined"
                            style={{ marginLeft: 4, marginRight: 18 }}
                            inputProps={{
                                style: { width: '170px', textAlign: 'center', fontWeight: 'bolder' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: 18, fontWeight: 'bolder' }
                            }} />
                        <TextField label="Portion per diner"
                            value={`${this.meal.portion} gr'`}
                            variant="filled"
                            className="txtFld noPointer"
                            InputLabelProps={{ "aria-readonly": true }} />
                        <TextField label="Total food quantity limitation"
                            value={`${(this.meal.totalDiners * this.meal.portion) / 1000} Kg`}
                            variant="filled"
                            className="txtFld noPointer w"
                            InputLabelProps={{ "aria-readonly": true }} />
                        <TextField label="Current amount of food"
                            value={`${this.mealQuantity.toFixed(2)} Kg`}
                            variant="filled"
                            className="txtFld noPointer"
                            InputLabelProps={{ "aria-readonly": true }}
                            InputProps={{
                                style: {
                                    color: (this.mealQuantity < (this.meal.portion * this.meal.totalDiners) / 1000) ? 'green' : 'red',
                                    backgroundColor: (this.mealQuantity < (this.meal.portion * this.meal.totalDiners) / 1000) ? '#F0FFFF' : '#FFE4E1'
                                }
                            }} />
                        <TextField label="Budget limitation"
                            value={this.meal.budget}
                            variant="filled"
                            className="txtFld noPointer"
                            InputLabelProps={{ "aria-readonly": true }} />
                        <TextField label="Actual meal expenses"
                            value={this.mealExpenses}
                            variant="filled"
                            className="txtFld noPointer"
                            InputLabelProps={{ "aria-readonly": true }}
                            InputProps={{
                                style: {
                                    color: (this.mealExpenses < this.meal.budget) ? 'green' : 'red',
                                    backgroundColor: (this.mealExpenses < this.meal.budget) ? '#F0FFFF' : '#FFE4E1'
                                }
                            }} />
                    </div>
                    <div className="mealDataDiv2">
                        <TextField label="Total diners number"
                            value={this.meal.totalDiners}
                            variant="filled"
                            className="txtFld noPointer"
                            InputLabelProps={{ "aria-readonly": true }} />
                        {this.meal.diners.map(d => 
                             <TextField label={d.dietType}
                                value={d.count}
                                variant="filled"
                                className="txtFld noPointer"
                                InputLabelProps={{ "aria-readonly": true }} />
                        )}
                    </div>
                    {this.meal.dishes.map(d => {
                        return <DishComp dish={d} key={d._id} />
                    })}
                    <ExpansionPanel key={'use-info'} id="exPanel" >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography variant="h6">Importemt info!</Typography>
                        </ExpansionPanelSummary>
                        <p>★ Each dish can be added with only one ingredient of a kind, in case of split ingredient in a same dish,</p>
                        <p>  please enter the whole quantity you want and give a note for spliting the item.</p>
                    </ExpansionPanel>
                    <Box my={2}>
                        <Fab variant='extended' color='primary' aria-label='add' onClick={() => { this.onAddDish() }}>
                            <Icon>add</Icon>Add Dish
                        </Fab>
                    </Box>
                </Fragment>
                }
            </div>
        );
    }
}

export default MealComp;