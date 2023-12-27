"use client";

import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useEffect,
  useState,
} from "react";

const StoreContext = createContext();

const isClient = typeof window !== "undefined";
const hasLocalStorage = typeof localStorage !== "undefined";

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error(
      "React Hands: The useStore hook must be used within a StoreProvider. Wrap your top level component or app in a react hands store provider!"
    );
  }
  return [store.state, store.dispatch];
}

export function storeConfig(initialState = {}, actions = {}) {
  // Add default __HYDRATE__ action
  const defaultActions = {
    __HYDRATE__: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    ...actions,
  };

  function reducer(state, action) {
    const handler = defaultActions[action.action];
    if (handler) {
      const prevState = { ...state }; // Track previous state

      try {
        const nextState = handler(state, action);

        // Check if state key should be persisted
        Object.keys(nextState).forEach((key) => {
          if (key.startsWith("local_") && hasLocalStorage) {
            localStorage.setItem(key, JSON.stringify(nextState[key]));
          }
        });

        return { ...prevState, ...nextState };
      } catch (error) {
        console.error(error);
        // Revert back to previous state in case of an error
        return prevState;
      }
    } else {
      console.error(
        `React Hands: The action "${action.action}" is not defined in store config actions`
      );
      return state;
    }
  }

  function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      if (isClient && hasLocalStorage && !isHydrated) {
        const persistedState = {};

        Object.keys(initialState).forEach((key) => {
          if (key.startsWith("local_")) {
            const value = localStorage.getItem(key);
            if (value !== null) {
              persistedState[key] = JSON.parse(value);
            }
          }
        });

        // fixes server side rendering hydration error
        dispatch({ action: "__HYDRATE__", payload: persistedState });
        setIsHydrated(true);
      }
    }, []);

    useEffect(() => {
      if (isClient && hasLocalStorage && isHydrated) {
        Object.keys(state).forEach((key) => {
          if (key.startsWith("local_")) {
            localStorage.setItem(key, JSON.stringify(state[key]));
          }
        });
      }
    }, [state]);

    const store = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
      <StoreContext.Provider value={store}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </StoreContext.Provider>
    );
  }

  return StoreProvider;
}

// * Additional Utilities
function ErrorBoundary({ children }) {
  const [error, setError] = useState(false);

  if (error) {
    // Render the fallback UI with the previous state
    return <>{children}</>;
  }

  return (
    <ErrorBoundaryWrapper onCatch={() => setError(true)}>
      {children}
    </ErrorBoundaryWrapper>
  );
}

// Todo: address warning - sonarlint(javascript:S6478) during performance adjustments phase
function ErrorBoundaryWrapper({ children, onCatch }) {
  class ErrorBoundaryComponent extends React.Component {
    componentDidCatch(error, errorInfo) {
      // Log the error to the error tracking service or console
      console.error(error, errorInfo);
      onCatch(); // Trigger error state update
    }

    render() {
      return this.props.children;
    }
  }

  return <ErrorBoundaryComponent>{children}</ErrorBoundaryComponent>;
}
