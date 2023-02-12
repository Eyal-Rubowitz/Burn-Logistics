import { Meal } from "../models/mealModel";
import { observable, action, computed } from "mobx";
import { AppRootModelsContext } from "../App";

export class SelectedEventStore {
  @observable selectedDate: string = "";
  @observable selectedMeal: string = "";
  @observable meal: Meal | undefined = undefined;
  @observable dateList: string[] = [];
  
  constructor() {
    let dates: Set<string> = new Set(this.meals.map(m => m.date.toLocaleDateString()));
    this.dateList = (dates) ? Array.from(dates).map(date => date) : [];
    
  }

  @computed get meals(): Meal[] {
    return AppRootModelsContext.mealModel.objectList.map(m => m);
  }

  @action onSelectedDate(newSelectedDate: string) {
    this.selectedDate = newSelectedDate;
  }

  @action onSelectedMeal(newSelectedMeal: string) {
    this.selectedMeal = newSelectedMeal;
  }

  @action onSelectMeal(newSelectedMeal: Meal) {
    this.meal = newSelectedMeal; 
  }
}

export type TSelectedEvent = ReturnType<typeof Object>