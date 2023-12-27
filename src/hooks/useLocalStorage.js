export const _useLocalStore = (generalKey = "default-key") => {
  // define a key to uniquely identify react-x-hands localStorage stuff
  let localStorageKey = generalKey;
  // let localStorageKey = Symbol();
  // console.log(localStorageKey());

  // handle auto reseting of storage
  const timeBomb = (key, cacheTime) => {
    if (typeof window) {
      setTimeout(() => {
        // localStorage.clear();
        set(key, "");
      }, cacheTime);
    }
  };

  // prepare the state to persist
  let stateToPersist = [];

  // updated whenever this function is called
  let persistedState = {};

  // if clear is passed first clear all existing state
  const resetLocalStore = () => {
    if (typeof window) {
      localStorage.clear();
    }
  };

  // define some little utilities
  let set = (key, stateToPersist) => {
    try {
      localStorage.setItem(key, JSON.stringify(stateToPersist));
    } catch (error) {
      throw new Error(`Error setting state ${key}: ${error}`);
    }
  };
  let get = (key) => {
    try {
      let state = JSON.parse(localStorage.getItem(key));
      if (state) {
        return state;
      } else {
        // console.error(`Local state ${key} not found!`);
        return null;
      }
    } catch (error) {
      throw new Error(`Error retrieving state ${key}: ${error}`);
    }
  };

  const setLocalStore = (
    key,
    currentState,
    { cacheTimeout = true, cacheTime = 60 * 1000 },
  ) => {
    if (typeof window) {
      // we on client, do stuff
      // try {
      //   let allStateKeys = Object.keys(currentState);
      //   let keysToPersist = allStateKeys.filter((key) => key.startsWith('$'));
      //   for (let key of keysToPersist) {
      //     let newPersistentState = { [key]: currentState[key] };
      //     stateToPersist = { ...stateToPersist, ...newPersistentState };
      //   }
      try {
        stateToPersist = currentState;
        let stateKey = key ?? localStorageKey;

        // enable time bomb
        // console.log('timeout:', stateKey, cacheTimeout, cacheTime);
        if (cacheTimeout === true) {
          timeBomb(stateKey, cacheTime);
        }

        if (get(stateKey)) {
          // check if state exists, if true update else create new state
          let oldLocalState = get(stateKey);
          let newLocalState = { ...oldLocalState, ...stateToPersist };
          set(stateKey, newLocalState);
          persistedState = get(stateKey);
          return persistedState;
        } else {
          // create new
          set(stateKey, stateToPersist);
          persistedState = get(stateKey);
          return persistedState;
        }
      } catch (error) {
        console.error(`Error Persisting State: ${error}`);
      }
    } else {
      return;
    }
  };

  const getLocalStore = (storageKey) => get(storageKey);

  return { getLocalStore, setLocalStore, resetLocalStore };
};
