import React from "react";
import { RootModel } from "./models/rootModel";
// import { createStore } from "./app-store-context/storeContext";
// import { MobXProviderContext } from 'mobx-react'

// const useStore = () => {
//     return React.useContext(MobXProviderContext);
// }

export const AppRootModel = new RootModel();
// export const StoreContext  = createStore();
// , StoreContext
export const ModelsContext = React.createContext({ AppRootModel });