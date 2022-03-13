import { AppRootModel } from '../modelsContext';

const wsEndpoint = process.env.wsEndpoint || "localhost:9000/ws";

const AppWS = new WebSocket(`ws://${wsEndpoint}`);
AppWS.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  console.log('ws data: ', data);
  switch (data.type) {
    case "users": {
      console.log('users case');
      AppRootModel.userModel.updateObjFromServer(data.obj);
      break;
    }
    case "meal": {
      console.log('meal case');
      AppRootModel.mealModel.updateObjFromServer(data.obj);
      break;
    }
    case "dish": {
      console.log('dish case');
      AppRootModel.dishModel.updateObjFromServer(data.obj);
      break;
    }
    case "ingredient": {
      console.log('ingredient case');
      AppRootModel.ingredientModel.updateObjFromServer(data.obj);
      break;
    }
    case "foodItem": {
      console.log('foodItem case');
      AppRootModel.foodItemModel.updateObjFromServer(data.obj);
      break;
    }
    case "inventory": {
      console.log('inventory case');
      AppRootModel.inventoryModel.updateObjFromServer(data.obj);
      break;
    }
    case "allergens": {
      console.log('allergens case');
      AppRootModel.allergensModel.updateObjFromServer(data.obj);
      break;
    }
    case "kitchenTools": {
      console.log('Kitchen tools case');
      AppRootModel.kitchenToolsModel.updateObjFromServer(data.obj);
      console.log('ws: ', data.obj);
      break;
    }
  }
});

export default AppWS;