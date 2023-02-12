import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';
import { Dish } from './dishModel';
import jwt from 'jsonwebtoken';


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

type IUserData = { name: string; email: string; iat: number; };


export class Meal extends ClassType {

    @observable chefId: string = '';
    @observable date: Date = new Date();
    @observable categoryType: string = '';
    @observable diners: DinersDiet[] = [];
    @observable budget: number = 0;
    @observable portion: number = 0;
    @observable preparing: Date = new Date();
    @observable serving: Date = new Date();
    @observable sousChefIdList: string[] = [];
    @observable cleaningCrewIdList: string[] = [];

    constructor(store: MealModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);
    }

    updateFromJson(obj: any): void {
        this.chefId = obj.chefId;
        this.date = (typeof obj.date === 'string') ? new Date(obj.date) : obj.date;
        this.categoryType = obj.categoryType;
        this.diners = obj.diners || [];
        this.budget = Number(obj.budget);
        this.portion = Number(obj.portion);
        this.preparing = (typeof obj.date === 'string') ? new Date(obj.preparing) : obj.preparing;
        this.serving = (typeof obj.date === 'string') ? new Date(obj.serving) : obj.serving;
        this.sousChefIdList = obj.sousChefIdList;
        this.cleaningCrewIdList = obj.cleaningCrewIdList;
    }

    @computed get chefName(): string {
        return this.store.root.userModel.objectList.find(u => u._id === this.chefId)?.fullName || "No chef found";
    } 

    @computed get memberListData(): Record<string, string> { 
        return this.store.root.userModel.objectList.reduce((o, user) => {
            o[user._id] = user.fullName
            return o;
        }, {} as Record<string, string>);
    }

    @computed get disList(): string[] {
        return this.store.root.dishModel.objectList.map(d => d.name);
    }

    @computed get dishes(): Dish[] {
        return this.store.root.dishModel.objectList.filter(d => d.mealId === this._id);
    }

    @computed get totalDiners(): number {
        return this.diners.reduce((ttl, diet) => ttl + diet.count, 0);
    }

    isConnectedUser(inputId: string): boolean {
        let userFound = this.store.root.userModel.objectList.find(u => u._id === inputId);
        let token = jwt.decode(localStorage.getItem('token') || '', {json: true}) as IUserData;
            return (userFound?.email === token.email) ? true : false;
    }

    deleteSousChefFromList(inputId: string): void {
        this.sousChefIdList = this.sousChefIdList.filter(id => id !== inputId);
        this.store.updateItem(this);
    }

    deleteCleaningMemberFromList(inputName: string): void {
        this.cleaningCrewIdList = this.cleaningCrewIdList.filter(id => id !== inputName);
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