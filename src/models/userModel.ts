import { observable } from 'mobx'; //, computed
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
    
    @observable fullName: string = '';
    @observable email: string = '';
    @observable password: string = '';
    // @observable allergens: string[] = [];
    // @observable shifts: string[] = [];
    // @observable eatingType: string = '';
    // @observable spicinessType: string = '';

    constructor(store: UserModel, obj: any) {
        super(store, obj);
        this.updateFromJson(obj);  
    }

    updateFromJson(obj: any) {
        this.fullName = obj.name;
        this.email = obj.email;
        this.password = obj.password;
        // this.allergens = obj.allergens;
        // this.shifts = obj.shifts; //?
        // this.eatingType = obj.eatingType;
        // this.spicinessType = obj.spicinessType;
    }

    // @computed get userToken(): any {
    //     this.store.root.userModel.items.filter(u => u.)
    // }

}