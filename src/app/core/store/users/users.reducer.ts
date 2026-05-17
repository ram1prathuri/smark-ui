import { createReducer, on } from '@ngrx/store';
import { User, UsersActions } from './users.actions';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
