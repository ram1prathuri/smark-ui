import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './core/interceptors/http.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AppHttpInterceptor,
    multi: true,
  },
],