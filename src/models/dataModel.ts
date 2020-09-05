import { observable } from 'mobx';
import { RootModel } from './rootModel';
import axios from 'axios';

export abstract class DataModel<TypeModel extends ClassType> {
    @observable items: Array<TypeModel>;
    root: RootModel;
    modelFactory: { new(a: DataModel<any>, n: TypeModel): TypeModel }
    host = process.env.apiHost || 'burnlogisticsserver-env.eba-d3akqtwa.eu-central-1.elasticbeanstalk.com' || 'localhost:9000';

    constructor(root: RootModel, grr: { new(a: DataModel<any>, n: TypeModel): TypeModel }) {
        this.root = root;
        this.modelFactory = grr;
        this.items = [];
        this.getItemsFromServer();
    }

    abstract resourcePath(): String

    get resourceUrl() {
        return `http://${this.host}/api/${this.resourcePath()}`
    }

    getItemsFromServer(): void {
        axios.get(this.resourceUrl).then(itemList => {
            itemList.data.forEach((item: TypeModel) => {
                this.updateItemFromServer(item);
            });
        });
    }

    createItem(json: TypeModel): void {
        let jsonObj = json.toJSON ? json.toJSON() : json;
        axios.post(this.resourceUrl, jsonObj);
        this.getItemsFromServer();
    }

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
        let json = Object.assign({}, this);
        delete json.store;
        return json;
    }
}