import { AppRootModel } from '../modelsContext';

const ws = new WebSocket("ws://localhost:3000/ws");
ws.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  console.log('ws data: ',data);
  switch(data.type) {
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
  }
  
});

export default ws;