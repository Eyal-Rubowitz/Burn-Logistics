import { AppRootModelsContext } from "../App";

const wsEndpoint = process.env.wsEndpoint || "localhost:9000/ws";

const AppWS = new WebSocket(`ws://${wsEndpoint}`);
AppWS.addEventListener("message", (msg) => {
  let data = JSON.parse(msg.data);
  console.log("ws data: ", data);
  switch (data.type) {
    case "users": {
      console.log("users case");
      AppRootModelsContext.userModel.updateObjFromServer(data.obj);
      break;
    }
    case "meal": {
      console.log("meal case");
      AppRootModelsContext.mealModel.updateObjFromServer(data.obj);
      break;
    }
    case "dish": {
      console.log("dish case");
      AppRootModelsContext.dishModel.updateObjFromServer(data.obj);
      break;
    }
    case "ingredient": {
      console.log("ingredient case");
      AppRootModelsContext.ingredientModel.updateObjFromServer(data.obj);
      break;
    }
    case "foodItem": {
      console.log("foodItem case");
      AppRootModelsContext.foodItemModel.updateObjFromServer(data.obj);
      break;
    }
    case "inventory": {
      console.log("inventory case");
      AppRootModelsContext.inventoryModel.updateObjFromServer(data.obj);
      break;
    }
    case "allergens": {
      console.log("allergens case");
      AppRootModelsContext.allergensModel.updateObjFromServer(data.obj);
      break;
    }
    case "kitchenTools": {
      console.log("Kitchen tools case");
      AppRootModelsContext.kitchenToolsModel.updateObjFromServer(data.obj);
      console.log("ws: ", data.obj);
      break;
    }
  }
});

export default AppWS;
