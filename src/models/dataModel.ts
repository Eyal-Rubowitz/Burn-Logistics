import { observable } from 'mobx';
import { RootModel } from './rootModel';
import axios from 'axios';

export abstract class DataModel<TypeModel extends ClassType> {
    @observable items: Array<TypeModel>;
    root: RootModel;
    modelFactory: { new(a: DataModel<any>, n: TypeModel): TypeModel }
    host = process.env.apiHost || 'localhost:3000';

    constructor(root: RootModel, grr: { new(a: DataModel<any>, n: TypeModel): TypeModel }) {
        this.root = root;
        this.modelFactory = grr;
        this.items = [];
        this.getItemsFromServer();
        this.getUserTokenFromServer();
    }

    abstract resourcePath(): String

    get resourceUrl() {
        return `http://${this.host}/api/${this.resourcePath()}`
    }

    getItemsFromServer(): void {
        axios.get(this.resourceUrl).then(itemList => {
            console.log('line 27 - data model list: ', itemList);
            itemList.data.forEach((item: TypeModel) => {
                this.updateItemFromServer(item);
            });
        });
    }

    // getUserFromServer(): void {
    //     axios.get(this.resourceUrl).then( u => {
    //         console.log('line 36 - data model list: ', itemList);
    //         u.data.then((user: TypeModel) => {
    //             this.updateUserFromServer(user);
    //         });
    //     });
    // }

    getUserTokenFromServer(): void {
        // token.id
        axios.get(this.resourceUrl).then(userList => {
            console.log('dataModel userList: ', userList);
            // userList.data.findOne((_id: token.id) 
            // {
            //     this.updateItemFromServer(user);
            // }
            // );
        }
        );
    }

    createItem(json: TypeModel): void {
        let jsonObj = json.toJSON ? json.toJSON() : json;
        axios.post(this.resourceUrl, jsonObj);
        this.getItemsFromServer();
    }

    // createUser(json: TypeModel): void {
    //     let jsonObj = json.toJSON ? json.toJSON() : json;
    //     axios.post(this.resourceUrl, jsonObj);
    //     this.getUserFromServer();
    // }

    updateItem(json: TypeModel): void {
        let jsonObj = json.toJSON ? json.toJSON() : json;
        axios.post(`${this.resourceUrl}/${jsonObj._id}/update`, jsonObj);
    }

    updateItemFromServer(json: TypeModel): void {
        let item = this.items.find(item => item._id === json._id);
        let jsonObj = new this.modelFactory(this, json).toJSON();
        if (!item) {
            let newItem = new this.modelFactory(this, jsonObj);
            this.items.push(newItem);
        } else if (json.isItemDeleted && item) {
            this.items.splice(this.items.indexOf(item), 1);
        } else {
            item.updateFromJson(json);
        }
    }

    removeItem(item: TypeModel): void {
        axios.post(`${this.resourceUrl}/${item._id}/delete`);
        this.getItemsFromServer();
    }
}

export abstract class ClassType {
    constructor(store: DataModel<any>, obj: any) {
        this.store = store;
        this._id = obj._id;
        if (obj.hasOwnProperty('isDeleted')) this.isItemDeleted = obj.isDeleted;
    }

    store: DataModel<any>;
    @observable _id: string;
    @observable isItemDeleted: boolean = false;

    abstract updateFromJson(obj: any): void;

    toJSON() {
        let json: any = Object.assign({}, this);
        delete json.store;
        return json;
    }
}