import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { usersReducer } from './core/store/users/users.reducer';
import { UsersEffects } from './core/store/users/users.effects';
import { postsReducer } from './core/store/posts/posts.reducer';
import { PostsEffects } from './core/store/posts/posts.effects';
//==========s7cy1j8b4FRVY5JXTY5uYP3huHIRm0GI=================//
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore({
      users: usersReducer,
      posts: postsReducer
    }),
    provideEffects([UsersEffects, PostsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ],
};
