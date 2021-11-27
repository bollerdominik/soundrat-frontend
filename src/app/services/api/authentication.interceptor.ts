import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token && !httpRequest.url.includes('files.')) {
      const authorizedRequest = httpRequest.clone(
        {headers: httpRequest.headers.set('Authorization', 'Bearer ' + token)});
      return next.handle(authorizedRequest);
    }
    return next.handle(httpRequest);
  }
}
