/* eslint-disable */
import { createStore, applyMiddleware, Store as ReduxStore } from "redux";
import thunk from "redux-thunk";
import { RootModules as modules } from "./RootStore";
import type { RootStoreState } from "./RootStore";

export { connect } from 'react-redux';
export type { RootStoreState };

export type StoreActionParam = {
    commit: any;
    dispatchAction: any;
    state: RootStoreState;
};

interface StoreModule {
    namespace: string;
    state: any;
    mutations: any;
    actions: any;
}

export type RootModulesType = { [name: string]: StoreModule };

type ReduxAction = { type: string; payload: any };

// @ts-ignore
const createModuleReducer = (module: StoreModule, state: RootStoreState = {}, action: ReduxAction) => {
    // @ts-ignore
    if (!state[module.namespace]) state[module.namespace] = module.state;

    const namespace = action.type.split("/")[0];
    const mutation = action.type.split("/")[1];

    if (module.namespace === namespace && typeof module.mutations[mutation] !== "function") {
        console.error('[Store] Failed to commit mutation. Type "' + mutation + '" does not exist in "' + namespace + '"');
        return state;
    }
    if (module.namespace === namespace && typeof module.mutations[mutation] === "function")
        return module.mutations[mutation](state, action.payload);

    return state;
};

const createRootReducer = (state: RootStoreState, action: ReduxAction) => {
    let rootState = { ...state };

    if (typeof action.type !== "string") {
        console.error('[Store] Failed to commit mutation. Type "' + action.type + '" is not a string');
        return rootState;
    }

    const namespace = action.type.split("/")[0];

    if (namespace !== "@@redux" && !modules[namespace]) {
        console.error('[Store] Failed to commit mutation. Module "' + namespace + '" not found');
        return rootState;
    }

    Object.values(modules).forEach((module: any) => {
        rootState = {
            ...rootState,
            ...createModuleReducer(module, state, action),
        };
    });

    return rootState;
};

interface Store extends ReduxStore {
    dispatchAction: any;
}

// @ts-ignore
const store: Store = createStore(createRootReducer, applyMiddleware(thunk));

// @ts-ignore
store.dispatchAction = (action: ReduxAction) => {
    if (typeof action.type !== "string") {
        console.error('[Store] Failed to dispatchAction. Type "' + action.type + '" is not a string');
        return;
    }
    const namespace = action.type.split("/")[0];
    const actionA = action.type.split("/")[1];

    // @ts-ignore
    if (!modules[namespace]) {
        console.error('[Store] Failed to dispatchAction. Module "' + namespace + '" not found');
        return;
    }

    // @ts-ignore
    if (typeof modules[namespace].actions[actionA] !== "function") {
        console.error('[Store] Failed to dispatchAction. Action "' + actionA + '" not found');
        return;
    }

    const state = store.getState();
    // @ts-ignore
    return store.dispatch(dispatch =>
        // @ts-ignore
        modules[namespace].actions[actionA](
            // @ts-ignore
            {
                commit: dispatch,
                state: state,
                // @ts-ignore
                dispatchAction: store.dispatchAction,
            },
            action.payload,
        ),
    );
};

export default store;