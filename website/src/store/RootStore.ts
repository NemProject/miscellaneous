import AnnouncementStore, { AnnouncementStoreState } from './AnnouncementStore';
import ExchangeStore, { ExchangeStoreState } from './ExchangeStore';
import { RootModulesType } from 'react-vuex-store';

export type RootStoreState = {
    announcement: AnnouncementStoreState;
    exchange: ExchangeStoreState;
};

export const RootModules: RootModulesType<RootStoreState> = {
    announcement: AnnouncementStore,
    exchange: ExchangeStore,
};
