import { AppRootModel } from '../modelsContext';

const wsEndpoint = process.env.wsEndpoint || "localhost:3000/ws";

const AppWS = new WebSocket(`ws://${wsEndpoint}`);
AppWS.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  console.log('ws data: ', data);
  switch (data.type) {
    case "meal": {
      console.log('meal case');
      AppRootModel.mealModel.updateItemFromServer(data.item);
      break;
    }
    case "dish": {
      console.log('dish case');
      AppRootModel.dishModel.updateItemFromServer(data.item);
      break;
    }
    case "ingredient": {
      console.log('ingredient case');
      AppRootModel.ingredientModel.updateItemFromServer(data.item);
      break;
    }
    case "foodItem": {
      console.log('foodItem case');
      AppRootModel.foodItemModel.updateItemFromServer(data.item);
      break;
    }
    case "inventory": {
      console.log('inventory case');
      AppRootModel.inventoryModel.updateItemFromServer(data.item);
      break;
    }
    case "allergans": {
      console.log('allergans case');
      AppRootModel.allergensModel.updateItemFromServer(data.item);
      break;
    }
    case "kitchenTools": {
      console.log('Kitchen tools case');
      AppRootModel.kitchenToolsModel.updateItemFromServer(data.item);
      console.log('ws: ', data.item);
      break;
    }
  }
});

export default AppWS;