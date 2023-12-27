// following library design: react-x-hands--latest-design.md
// see implementation demo usage in demo-app.jsx
// Todo: minimize multiple re-renders -- could try use-context-selector

// just incase we in a next js environment
'use client';

import { useState, useContext, createContext, useMemo } from 'react';

// create a store context
const StoreContext = createContext();

// define global store
let store = {};

// Create a provider
export const StoreProvider = ({ children, initialState }) => {
  // initialize store with initial state
  if (initialState) {
    const { get, syncLocalStore } = _useLocalStore();
    const initialLocalState = get();
    if (initialLocalState) {
      // sync state with old persisted states
      store = { ...initialState, ...initialLocalState };
    } else {
      const localState = syncLocalStore(initialState);
      if (localState) {
        // sync state with new persisted states
        store = { ...initialState, ...localState };
      }
    }
  } else {
    throw new Error(
      `React X Hands: No initial state, please provide some initial state and pass it to your storeProvider and wrap your App with the provider!`
    );
  }

  const memoizedStore = useMemo(() => store, [store]);

  return (
    <StoreContext.Provider value={memoizedStore}>
      {children}
    </StoreContext.Provider>
  );
};

// store usage function
export const useStore = (stateKey) => {
  const contextValue = useContext(StoreContext);

  // Check if the state key exists in the context
  if (!(stateKey in contextValue)) {
    throw new Error(
      `React X Hands: state key "${stateKey}" not found in StoreContext, please declare it in initial state passed to your store provider!`
    );
  }

  let _store = contextValue;
  let stateValue = _store[stateKey];
  const [_state, _setState] = useState(stateValue);

  const setState = (newState) => {
    let prevState = _state;
    let nextState =
      typeof newState === 'function' ? newState(prevState) : newState;
    if (prevState === nextState) {
      return;
    }
    _setState(newState);
    // sync global store with  new state
    store = { ...store, [stateKey]: nextState };

    if (String(stateKey)[0] === '$') {
      const { syncLocalStore } = _useLocalStore();
      const __ = syncLocalStore(store);
    }
  };

  // return contextValue[stateKey];
  return [_state, setState];
};

// handle local storage
const _useLocalStore = (reset = null) => {
  // define a key to uniquely identify react-x-hands localStorage stuff
  let localStorageKey = 'react-x-hands';

  // prepare the state to persist
  let stateToPersist = [];

  // updated whenever this function is called
  let persistedState = {};

  // if clear is passed first clear all existing state
  if (reset === 'reset') {
    localStorage.clear();
  }

  // define some little utilities
  let set = (stateToPersist) => {
    localStorage.setItem(localStorageKey, JSON.stringify(stateToPersist));
  };
  let get = () => JSON.parse(localStorage.getItem(localStorageKey));

  const syncLocalStore = (currentState) => {
    if (typeof window !== undefined) {
      // we on client, do stuff
      try {
        let allStateKeys = Object.keys(currentState);
        let keysToPersist = allStateKeys.filter((key) => key.startsWith('$'));
        for (let key of keysToPersist) {
          let newPersistentState = { [key]: currentState[key] };
          stateToPersist = { ...stateToPersist, ...newPersistentState };
        }

        // check if state exists, if true update else create new state
        if (localStorage.getItem(localStorageKey)) {
          let oldLocalState = get();
          let newLocalState = { ...oldLocalState, ...stateToPersist };
          set(newLocalState);
          persistedState = get();
          return persistedState;
        } else {
          // create new
          set(stateToPersist);
          persistedState = get();
          return persistedState;
        }
      } catch (error) {
        console.error(`Error Persisting State: ${error}`);
      }
    } else {
      return;
    }
  };

  return { get, syncLocalStore };
};
