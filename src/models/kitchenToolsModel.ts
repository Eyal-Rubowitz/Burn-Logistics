import { observable } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';

export class KitchenToolsModel extends DataModel<KitchenTool> {

    constructor(root: RootModel) {
        super(root, KitchenTool);
    }

    resourcePath(): String {
        return "kitchenTools";
    }
}

export class KitchenTool extends ClassType {
    constructor(store: KitchenToolsModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);  
    }

    updateFromJson(obj: any) {
        this.kitchenItem = obj.kitchenItem;
        this.quantity = Number(obj.quantity);
        this.category = obj.category;
    }

    @observable kitchenItem: string = '';
    @observable quantity: number = 0;
    @observable category: string = '';
}