import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
}

export const UsersActions = createActionGroup({
  source: 'Users API',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
  }
});
