import { observable } from "mobx";
import { Meal } from "../models/mealModel";

export default class SelectedMealStore {
    @observable meal?: Meal = undefined
    @observable selectedDate: string = "";
    @observable selectedMeal: string = "";
    @observable dateList: string[] = [];
}