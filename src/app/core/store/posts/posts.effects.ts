import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Post, PostsActions } from './posts.actions';

@Injectable()
export class PostsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.loadPosts),
      mergeMap(() =>
        this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').pipe(
          map(posts => PostsActions.loadPostsSuccess({ posts })),
          catchError(error => of(PostsActions.loadPostsFailure({ error: error.message })))
        )
      )
    )
  );
}
