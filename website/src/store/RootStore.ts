import BookStore, { BookStoreState } from './BookStore';
import { RootModulesType } from './index';

export type RootStoreState = {
    book: BookStoreState;
};

export const RootModules: RootModulesType = {
    book: BookStore,
};
