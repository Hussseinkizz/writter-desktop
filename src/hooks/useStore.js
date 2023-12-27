import { createContext, useContext, useReducer, useMemo } from 'react';

// Todo: perhaps for bugs' sake add type safty in here!

// The Banker
export const storeContext = createContext();
const initialState = {
  pageTitle: 'Home',
  showSideBar: true,
  darkmode: false,
};

// The Handler
function reducer(state, action) {
  // const { type, payload } = action;

  // functions / operators
  // function incrementCount(currentState) {
  //   return currentState + 1;
  // }
  // function decrementCount(currentState) {
  //   return currentState - 1;
  // }

  switch (action.type) {
    // Handle Page Title
    case 'SET_TITLE':
      return {
        ...state,
        pageTitle: action?.payload,
      };
    // Handle SideBar Menu
    case 'OPEN_SIDEBAR':
      return {
        ...state,
        showSideBar: true,
      };
    case 'CLOSE_SIDEBAR':
      return {
        ...state,
        showSideBar: false,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        showSideBar: !state.showSideBar,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        darkmode: !state.darkmode,
      };
    default:
      throw new Error(`No action for type ${action?.type} in state machine!`);
  }
}

// The Provider
export function StoreProvider({ children }) {
  const [store, setStore] = useReducer(reducer, initialState);
  // memorise state value to prevent re-renders!
  const memorisedValue = useMemo(
    () => ({
      store,
      setStore,
    }),
    [store]
  );
  return (
    <storeContext.Provider value={memorisedValue}>
      {children}
    </storeContext.Provider>
  );
}

// The consumer
export function useStore() {
  const useStore = useContext(storeContext);

  if (useStore === undefined) {
    throw new Error(
      'UseStore must be consumed within the store context, make sure you wrapped the app in a store provider!'
    );
  }

  return useStore;
}

// Notes to dev:
// look into immer js for iterating arrays and how to inbuid it right away!
/* useEffectReducer also seems interesting, then preact signals, persistent state with useMemo, useCallback and localStorage and what not? */
