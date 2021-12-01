import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import UnitEnum from '../enums/unitEnum';
import { AppRootModel } from '../modelsContext';
import { FoodItem } from './foodItemModel';
import { Dish } from './dishModel';
import { Meal } from './mealModel';

export class InventoryModel extends DataModel<InventoryItem> {

    constructor(root: RootModel) {
        super(root, InventoryItem)
    }

    resourcePath(): String {
        return "inventory"
    }
}

export class InventoryItem extends ClassType {
    constructor(store: InventoryModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);
    }

    updateFromJson(obj: any): void {
        this.foodItemId = obj.foodItemId;
        this.quantity = Number(obj.quantity);
        this.unit = obj.unit;
        this.expirationDate = (typeof obj.expirationDate === 'string') ? new Date(obj.expirationDate) : obj.expirationDate;
        this.note = obj.note;
        this.dishIdOwnedItem = obj.dishIdOwnedItem;
    }

    @observable foodItemId: string = '';
    @observable quantity: number = 0;
    @observable unit?: UnitEnum = undefined;
    @observable expirationDate?: Date = new Date();
    @observable note: string = '';
    @observable dishIdOwnedItem: string = ''; 

    @computed get foodItem(): FoodItem {
        return AppRootModel.foodItemModel.items.find(fi => fi._id === this.foodItemId) as FoodItem;
    }

    @computed get name(): string {
        let name: string = (this.foodItem === undefined) ? 'Name is missing' : this.foodItem.name;
        return name;
    }

    @computed get convertedQuantity(): number {
        return (this.unit && this.foodItem) ?
            this.foodItem.convertUnits(this.unit.toString(), Number(this.quantity.toFixed(3))) :
            NaN
    }

    checkForHexRegExpObjectID: RegExp = new RegExp("^[0-9a-fA-F]{24}$");
    @computed get ownedItemChefName(): string {
        if(this.checkForHexRegExpObjectID.test(this.dishIdOwnedItem)) {
            let dish: Dish | undefined = AppRootModel.dishModel.items.find(d => d._id === this.dishIdOwnedItem);
            let meal: Meal | undefined = AppRootModel.mealModel.items.find(m => m._id === ((dish) ? dish.mealId : ''));
            return (meal !== undefined) ? meal.chef : 'Item Is Free';
        } else {
            return 'Item Is Free';
        }
    }

    @computed get toStringDate(): string {
        let stringTime: string = (this.expirationDate) ? this.expirationDate.toLocaleDateString() : 'Has no expiration date';
        return stringTime;
    }
}