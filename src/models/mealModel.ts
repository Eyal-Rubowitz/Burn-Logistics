import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import { Dish } from './dishModel';

export class MealModel extends DataModel<Meal> {

    constructor(root: RootModel) {
        super(root, Meal);
    }

    resourcePath(): String {
        return "meals";
    }
}

export class DinersDiet {
    constructor(public count: number, public dietType: string) { }
}

export class Meal extends ClassType {

    @observable chef: string = '';
    @observable date: Date = new Date();
    @observable name: string = '';
    @observable diners: DinersDiet[] = [];
    @observable budget: number = 0;
    @observable portion: number = 0;
    @observable preparing: Date = new Date();
    @observable serving: Date = new Date();
    @observable sousChefList: string[] = [];
    @observable cleaningCrewList: string[] = [];

    constructor(store: MealModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);
    }

    updateFromJson(obj: any): void {
        this.chef = obj.chef;
        this.date = (typeof obj.date === 'string') ? new Date(obj.date) : obj.date;
        this.name = obj.name;
        this.diners = obj.diners || [];
        this.budget = Number(obj.budget);
        this.portion = Number(obj.portion);
        this.preparing = (typeof obj.date === 'string') ? new Date(obj.preparing) : obj.preparing;
        this.serving = (typeof obj.date === 'string') ? new Date(obj.serving) : obj.serving;
        this.sousChefList = obj.sousChefList;
        this.cleaningCrewList = obj.cleaningCrewList;
    }

    @computed get dishes(): Dish[] {
        return this.store.root.dishModel.items.filter(d => d.mealId === this._id);
    }

    @computed get totalDiners(): number {
        return this.diners.reduce((ttl, diet) => ttl + diet.count, 0);
    }

    deleteSousChefFromList(inputName: string): void {
        this.sousChefList = this.sousChefList.filter(name => name !== inputName);
        this.store.updateItem(this);
    }

    deleteCleaningMemberFromList(inputName: string): void {
        this.cleaningCrewList = this.cleaningCrewList.filter(name => name !== inputName);
        this.store.updateItem(this);
    }

    addDietType(dietName: string): void {
        let dietToUpdate = this.diners.find(d => d.dietType === dietName);
        if(dietName !== dietToUpdate?.dietType || dietName !== '') this.diners.push(new DinersDiet(0, dietName));
    }

    updateDietTypeDinersNum(dietName: string, diners: number): void {
        let dietToUpdate = this.diners.find(d => d.dietType === dietName);
        if (dietToUpdate) {
            dietToUpdate.count = diners
            this.store.updateItem(this);
        } else {
            this.diners.push(new DinersDiet(0, dietName));
        }
    }

    getTotalMealDiners(): number {
        return this.diners.reduce((ttl, d) => ttl + d.count, 0);
    }

    deleteDietType(dietName: string): void {
        this.diners = this.diners.filter( d => d.dietType !== dietName)
        this.store.updateItem(this);
    }
}