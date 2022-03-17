import { UserModel } from './userModel';
import { MealModel } from "./mealModel";
import { DishModel } from "./dishModel";
import { IngredientModel } from "./ingredientModel";
import { FoodItemModel } from "./foodItemModel";
import { InventoryModel } from "./inventoryModel";
import { AllergensModel } from "./allergensModel";
import { KitchenToolsModel } from './kitchenToolsModel';


export class RootModel {
    constructor() {
        this.userModel = new UserModel(this);
        this.ingredientModel = new IngredientModel(this);
        this.mealModel = new MealModel(this);
        this.dishModel = new DishModel(this);
        this.foodItemModel = new FoodItemModel(this);
        this.inventoryModel = new InventoryModel(this);
        this.allergensModel = new AllergensModel(this);
        this.kitchenToolsModel = new KitchenToolsModel(this);
    }

    userModel: UserModel;
    ingredientModel: IngredientModel;
    mealModel: MealModel;
    dishModel: DishModel;
    foodItemModel: FoodItemModel;
    inventoryModel: InventoryModel;
    allergensModel: AllergensModel;
    kitchenToolsModel: KitchenToolsModel;
}