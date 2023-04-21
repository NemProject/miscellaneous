/* eslint-disable */
import { ReactVuexStore } from 'react-vuex-store';
import { RootModules as modules } from './RootStore';
import type { RootStoreState } from './RootStore';

export { connect } from 'react-redux';
export type { RootStoreState };


export default new ReactVuexStore<RootStoreState>(modules).createStore();