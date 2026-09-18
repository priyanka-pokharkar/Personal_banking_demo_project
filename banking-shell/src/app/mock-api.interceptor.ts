import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private readonly HARDCODED_TOKEN = 'Bearer mock-banking-jwt-token-987654321';

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url;

    if (url.includes('/api/login')) {
      const body = request.body as { username?: string; password?: string };

      // Check hardcoded credentials
      if (body?.username === 'Sarah' && body?.password === '12345') {
        return of(
          new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Login successful',
              token: this.HARDCODED_TOKEN,
              user: {
                username: 'Sarah',
                role: 'Administrator'
              }
            }
          })
        ).pipe(delay(100));
      } else {
        // Return a mock 401 error if credentials don't match
        return throwError(() => ({
          status: 401,
          error: { message: 'Invalid username or password.' }
        })).pipe(delay(100));
      }
    }

    if (url.includes('/api/logout')) {
      return of(
        new HttpResponse({
          status: 200,
          body: {
            success: true,
            message: 'Logged out successfully',
            token: this.HARDCODED_TOKEN
          }
        })
      ).pipe(delay(100));
    }

    return next.handle(request);
  }
}