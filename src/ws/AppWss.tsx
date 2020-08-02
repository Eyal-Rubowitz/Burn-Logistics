import { AppRootModel } from '../modelsContext';

const port = process.env.port || 3000;

const ws = new WebSocket(`ws://localhost:${port}/ws`);
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