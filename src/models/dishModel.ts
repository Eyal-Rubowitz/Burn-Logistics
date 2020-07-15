import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import { Meal } from './mealModel';
import { Ingredient } from './ingredientModel';

export class DishModel extends DataModel<Dish> {

    constructor(root: RootModel) {
        super(root, Dish);
    }

    resourcePath(): String {
        return "dishes";
    }
}

export class Dish extends ClassType {
    constructor(store: DishModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);  
    }

    updateFromJson(obj: any): void {
        this.name = obj.name;
        this.mealId = obj.mealId;
    }

    @observable name: string = '';
    @observable mealId: string = '';

    @computed get ingrediants(): Ingredient[] {
        return this.store.root.ingredientModel.items.filter(i => i.dishId === this._id);
    }

    @computed get meal(): Meal | undefined {
        return this.store.root.mealModel.items.find(m => m._id === this.mealId);
    }
}