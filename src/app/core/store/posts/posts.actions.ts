import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const PostsActions = createActionGroup({
  source: 'Posts API',
  events: {
    'Load Posts': emptyProps(),
    'Load Posts Success': props<{ posts: Post[] }>(),
    'Load Posts Failure': props<{ error: string }>(),
  }
});
