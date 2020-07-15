import { MealModel } from "./mealModel";
import { DishModel } from "./dishModel";
import { IngredientModel } from "./ingredientModel";
import { FoodItemModel } from "./foodItemModel";
import { InventoryModel } from "./inventoryModel";
import { AllergansModel } from "./allergensModel";
import { KitchenToolsModel } from './kitchenToolsModel';

export class RootModel {
    constructor() {
        this.ingredientModel = new IngredientModel(this);
        this.mealModel = new MealModel(this);
        this.dishModel = new DishModel(this);
        this.foodItemModel = new FoodItemModel(this);
        this.inventoryModel = new InventoryModel(this);
        this.allergensModel = new AllergansModel(this);
        this.kitchenToolsModel = new KitchenToolsModel(this);
    }

    mealModel: MealModel;
    dishModel: DishModel;
    ingredientModel: IngredientModel;
    foodItemModel: FoodItemModel;
    inventoryModel: InventoryModel;
    allergensModel: AllergansModel;
    kitchenToolsModel: KitchenToolsModel;
}