import { observable } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';

export class AllergansModel extends DataModel<Allergans> {
    constructor(root: RootModel) {
        super(root, Allergans);
    }

    resourcePath(): String {
        return "allergans";
    }
}

export class Allergans extends ClassType {
    constructor(store: AllergansModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);  
    }

    updateFromJson(obj: any): void {
        this.name = obj.name;
        this.foodItemIdList = obj.foodItemIdList;
        this.dinersNameList = obj.dinersNameList;
    }

    @observable name: string = '';
    @observable foodItemIdList: string[] = [];
    @observable dinersNameList: string[] = [];

    deleteDinerNameFromList(dinerName: string): void {
        this.dinersNameList = this.dinersNameList.filter(fId => fId !== dinerName);
        this.store.updateItem(this);
    }

    deleteFoodItemFromList(foodId: string): void {
        this.foodItemIdList = this.foodItemIdList.filter(fId => fId !== foodId);
        this.store.updateItem(this);
    }
}