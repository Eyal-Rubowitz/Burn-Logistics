import { observable } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';

export class AllergensModel extends DataModel<Allergens> {
    constructor(root: RootModel) {
        super(root, Allergens);
    }

    resourcePath(): String {
        return "allergens";
    }
}

export class Allergens extends ClassType {
    constructor(store: AllergensModel, obj: any) {
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