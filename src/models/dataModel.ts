import { observable } from 'mobx';
import { RootModel } from './rootModel';
import axios from 'axios';

export abstract class DataModel<TypeModel extends ClassType> {
    @observable objectList: Array<TypeModel>;
    root: RootModel;
    modelFactory: { new(dm: DataModel<any>, tm: TypeModel): TypeModel }
    host = process.env.apiHost || 'localhost:3000';

    constructor(root: RootModel, mf: { new(dm: DataModel<any>, tm: TypeModel): TypeModel }) {
        this.root = root;
        this.modelFactory = mf;
        this.objectList = [];
        this.getListFromServer();
        // this.getUserTokenFromServer();
    }

    abstract resourcePath(): String

    get resourceUrl() {
        return `http://${this.host}/api/${this.resourcePath()}`
    }

    // changed getItemsFromServer() to getListFromServer()
    // and itemList to objList
    // getItemsFromServer(): void {
    getListFromServer(): void {
            axios.get(this.resourceUrl).then(objList => {
                objList.data.forEach((obj: TypeModel) => {
                    this.updateObjFromServer(obj);
                });
            });
    }

    isUserConnected = async (inputId: string): Promise<boolean> => {
        let resValidate = false;
        axios.post('http://localhost:3000/api/users/user-validate', inputId).then(res => resValidate = res.data);
    //     const response = await fetch('http://localhost:3000/api/users/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // camp: this.camp,
        
    //   })
    // });

    // const jsonData = await response.json();
        return resValidate;
    }

    // getUserTokenFromServer(): void {
    //     // token.id
    //     axios.get(this.resourceUrl).then(userList => {
    //         console.log('dataModel userList: ', userList);
    //         // userList.data.findOne((_id: token.id) 
    //         // {
    //         //     this.updateItemFromServer(user);
    //         // }
    //         // );
    //     }
    //     );
    // }

    createObject(json: TypeModel): void {
        const jsonObj = json.toJSON ? json.toJSON() : json;
        axios.post(this.resourceUrl, jsonObj);
        this.getListFromServer();
    }

    // createUser(json: TypeModel): void {
    //     let jsonObj = json.toJSON ? json.toJSON() : json;
    //     axios.post(this.resourceUrl, jsonObj);
    //     this.getUserFromServer();
    // }

    updateItem(json: TypeModel): void {
        const jsonObj = json.toJSON ? json.toJSON() : json;
        axios.post(`${this.resourceUrl}/${jsonObj._id}/update`, jsonObj);
    }

    updateObjFromServer(json: TypeModel): void {
        const obj = this.objectList.find(obj => obj._id === json._id);
        const jsonObj = new this.modelFactory(this, json).toJSON();
        if (!obj) {
            let newObj = new this.modelFactory(this, jsonObj);
            this.objectList.push(newObj);
        } else if (json.isObjDeleted && obj) {
            this.objectList.splice(this.objectList.indexOf(obj), 1);
        } else {
            obj.updateFromJson(json);
        }
    }

    removeItem(item: TypeModel): void {
        axios.post(`${this.resourceUrl}/${item._id}/delete`);
        this.getListFromServer();
    }
}

export abstract class ClassType {
    constructor(store: DataModel<any>, obj: any) {
        this.store = store;
        this._id = obj._id;
        if (obj.hasOwnProperty('isDeleted')) this.isObjDeleted = obj.isDeleted;
    }

    store: DataModel<any>;
    @observable _id: string;
    @observable isObjDeleted: boolean = false;

    abstract updateFromJson(obj: any): void;

    toJSON() {
        let json: any = Object.assign({}, this);
        delete json.store;
        return json;
    }
}