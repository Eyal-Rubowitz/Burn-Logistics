import { observable, computed } from 'mobx';
import { RootModel } from './rootModel';
import { DataModel, ClassType } from './dataModel';

export class UserModel extends DataModel<User> {

    constructor(root: RootModel) {
        super(root, User);
    }

    resourcePath(): String {
        return "userAuth";
    }
}

export class User extends ClassType {
    constructor(store: UserModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);  
    }

    updateFromJson(obj: any) {
        this.name = obj.name;
    }

    @observable name: string = '';
}