import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { PreloaderService } from '../services/preloader.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private preloaderService: PreloaderService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.preloaderService.show();

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            // Handle successful responses if needed
          }
        },
        error: (error) => {
          this.errorHandlerService.handleError(error);
        },
      }),
      finalize(() => {
        this.preloaderService.hide();
      })
    );
  }
}