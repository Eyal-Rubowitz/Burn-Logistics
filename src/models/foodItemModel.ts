import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import FoodCategoryEnum from '../enums/foodCategoryEnum';
import UnitEnum from '../enums/unitEnum';
import { AppRootModel } from '../modelsContext';

export class FoodItemModel extends DataModel<FoodItem> {

    constructor(root: RootModel) {
        super(root, FoodItem);
    }

    resourcePath(): String {
        return "foodItems";
    }
}

export class CustomUnit {
    constructor(public unitName: string, public ratio: number) { }
}

export class FoodItem extends ClassType {

    @observable name: string = '';
    @observable category: FoodCategoryEnum = FoodCategoryEnum.Cooling;
    @observable baseUnit: UnitEnum = UnitEnum.Kilogram;
    @observable customUnits: CustomUnit[] = [];

    constructor(store: FoodItemModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);
    }

    updateFromJson(obj: any) {
        this.name = obj.name;
        this.category = obj.category;
        this.baseUnit = obj.baseUnit;
        this.customUnits = obj.customUnits || [];
    }

    convertUnits(unit: string, quantity: number): number {
        let ratio;
        if (unit === 'Kg' || unit === 'L') {
            ratio = 1;
        } else if (unit === 'gr' || unit === 'ml') {
            ratio = 0.001;
        } else {
            ratio = (this.customUnits.find(u => u.unitName === unit) || { ratio: NaN }).ratio;
        }
        return quantity * ratio;
    }

    deleteCustomUnit(customUnit: string): void {
        let foodItemIngList = AppRootModel.ingredientModel.objectList.filter(ing => ing.foodItemId === this._id)
        let ingUseCustomUnit = foodItemIngList.find(ing => ing.unit === customUnit);
        if(!ingUseCustomUnit){
            this.customUnits = this.customUnits.filter(cu => cu.unitName !== customUnit);
            this.store.updateItem(this);
        }
    }

    @computed get foodUnits(): string[] {
        let units = this.customUnits.map(un => un.unitName);
        if (this.baseUnit === UnitEnum.Kilogram) units.unshift(UnitEnum.Kilogram, UnitEnum.Gram);
        if (this.baseUnit === UnitEnum.Liter) units.unshift(UnitEnum.Liter, UnitEnum.Milliliter);
        return units;
    }
}

