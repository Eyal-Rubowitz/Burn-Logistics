import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import { observable, computed } from 'mobx';
import { FoodItem } from './foodItemModel';
import UnitEnum from '../enums/unitEnum';
import { Dish } from './dishModel';
import { Meal } from './mealModel';
import { AppRootModel } from '../modelsContext';

export class IngredientModel extends DataModel<Ingredient> {

    constructor(root: RootModel) {
        super(root, Ingredient)
    }

    resourcePath(): String {
        return "ingredients"
    }
}

export class Ingredient extends ClassType {
    constructor(store: IngredientModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);
    }

    updateFromJson(obj: any) {
        this.dishId = obj.dishId;
        this.foodItemId = obj.foodItemId;
        this.quantity = Number(obj.quantity);
        this.unit = obj.unit;
        this.cost = Number(obj.cost);
        this.note = obj.note;
    }

    @observable dishId: string = '';
    @observable foodItemId: string = '';
    @observable quantity: number = 0;
    @observable unit?: UnitEnum = undefined;
    @observable cost: number = 0;
    @observable note: string = '';

    @computed get foodItem(): FoodItem {
        return this.store.root.foodItemModel.objectList.find(fi => fi._id === this.foodItemId) as FoodItem;
    }

    @computed get name(): string {
        let name = (this.foodItem === undefined) ? 'Name is missing' : this.foodItem.name;
        return name;
    }

    @computed get category(): string {
        let name = (this.foodItem === undefined) ? 'Category is missing' : this.foodItem.category;
        return name;
    }

    @computed get dish(): Dish {
        return this.store.root.dishModel.objectList.find(d => d._id === this.dishId) as Dish;
    }

    @computed get chef(): string {
        let chefMeal = this.dish && this.dish.meal;
        return chefMeal ? chefMeal.chefName : 'Chef is missing';
    }

    @computed get convertedQuantity(): number {
        return (this.unit && this.foodItem) ?
            this.foodItem.convertUnits(
                this.unit.toString(),
                (this.quantity % 1 === 0) ? this.quantity : Number(this.quantity.toFixed(3))
            ) :
            NaN
    }

    @computed get getItemBaseUnit(): string {
        let bu = (this.foodItem === undefined) ? 'Base unit is missing' : this.foodItem.baseUnit;
        return bu;
    }

    @computed get appointmentTime(): string {
        let meal = (this.dish === undefined) ? undefined : this.store.root.mealModel.objectList.find(m => m._id === this.dish.mealId) as Meal;
        return (meal === undefined) ? 'Date is missing' : meal.date.toLocaleDateString() + " - " + meal.categoryType
    }
    
    // is ingredient already includes in inventory...
    @computed get getInvIdByItem(): string {
        let inv = AppRootModel.inventoryModel.objectList.find(inv => inv.dishIdOwnedItem === this.dishId && inv.foodItemId === this.foodItemId);
        return (inv) ? inv._id : "";
    }
}