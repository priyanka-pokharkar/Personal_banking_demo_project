import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface AemContentItem {
  key: string;
  [key: string]: any;
}

export interface AemResponse {
  screenCoverage?: string;
  moduleIdentifier?: string;
  content?: Array<{
    screenIdentifier?: string;
    screenContent?: AemContentItem[];
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AemDataService {
  private mockUrl = 'assets/data/aem-mock-data.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetches AEM data and transforms array items into a key-indexed map dictionary.
   */
  getAemContent(): Observable<Record<string, Record<string, any>>> {
    return this.http.get<AemResponse>(this.mockUrl).pipe(
      map((response) => {
        const screenContent = response?.content?.[0]?.screenContent;
        if (!Array.isArray(screenContent)) {
          return {};
        }

        return screenContent.reduce((acc, item) => {
          if (item.key) {
            acc[item.key] = item;
          }
          return acc;
        }, {} as Record<string, Record<string, any>>);
      }),
      catchError((error) => {
        console.warn('AEM fetch failed. Fallbacks will be applied.', error);
        return of({});
      })
    );
  }
}