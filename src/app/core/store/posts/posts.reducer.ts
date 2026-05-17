import { createReducer, on } from '@ngrx/store';
import { Post, PostsActions } from './posts.actions';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const initialPostsState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const postsReducer = createReducer(
  initialPostsState,
  on(PostsActions.loadPosts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PostsActions.loadPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false
  })),
  on(PostsActions.loadPostsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
