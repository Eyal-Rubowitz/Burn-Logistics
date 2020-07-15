import React from 'react'
import { SelectedEventStore } from './selectEventContext'
import { useLocalStore } from 'mobx-react';

export const storesContext = React.createContext({
  selectedEventStore: new SelectedEventStore(),
})

export const StoreProvider = ({ children }: any): JSX.Element => {
  const store = useLocalStore(() => ({
     selectedEventStore: new SelectedEventStore(),
  }));

  return <storesContext.Provider value={store}>{children}</storesContext.Provider>
}