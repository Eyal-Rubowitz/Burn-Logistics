import React from "react";
import { SelectedEventStore } from "./selectEventContext";
import { useLocalStore } from "mobx-react";
// import { RootModel } from "../models/rootModel";

// console.log("We're initializing the RootModel!");
// export const AppRootModelsContext = new RootModel("token1");

export const storesContext = React.createContext({
  selectedEventStore: new SelectedEventStore(),
});

export const StoreProvider = ({ children }: any): JSX.Element => {
  const store = useLocalStore(() => ({
    selectedEventStore: new SelectedEventStore(),
  }));

  return (
    <storesContext.Provider value={store}>{children}</storesContext.Provider>
  );
};
