import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DASHBOARD_CONSTANTS } from '../../dashboard.constant';

@Component({
  selector: 'app-cards-overview',
  templateUrl: './cards-overview.component.html',
  styleUrls: ['./cards-overview.component.scss']
})
export class CardsOverviewComponent {
  private http = inject(HttpClient);

  /**
   * Fetches AEM JSON data, maps it into a dictionary, and converts the Observable stream 
   * directly into a Signal with DASHBOARD_CONSTANTS as the fallback initial value.
   */
  readonly aemData = toSignal(
    this.http.get<any>('http://localhost:4202/assets/data/aem-mock-data.json').pipe(
      map((response) => {
        const screenContent = response?.content?.[0]?.screenContent;
        if (!Array.isArray(screenContent)) {
          return DASHBOARD_CONSTANTS;
        }

        const fetchedMap = screenContent.reduce((acc, item) => {
          if (item.key) {
            acc[item.key] = item;
          }
          return acc;
        }, {} as Record<string, Record<string, any>>);

        return this.computeRevampFallback(fetchedMap);
      }),
      catchError((err) => {
        console.warn('AEM fetch failed, using fallback constants:', err);
        return of(DASHBOARD_CONSTANTS);
      })
    ),
    { initialValue: DASHBOARD_CONSTANTS }
  );

  /**
   * Computes merged dataset combining local constants with fetched AEM data
   * while protecting fallback values from being overridden by empty strings, null, or undefined.
   */
  private computeRevampFallback(
    fetchedData: Record<string, Record<string, any>>
  ): Record<string, Record<string, any>> {
    const mergedData: Record<string, Record<string, any>> = {};
    const keys = new Set([...Object.keys(DASHBOARD_CONSTANTS), ...Object.keys(fetchedData)]);

    keys.forEach((key) => {
      const localObj = DASHBOARD_CONSTANTS[key] || {};
      const fetchedObj = fetchedData[key] || {};
      
      const mergedObj: Record<string, any> = { ...localObj };

      Object.keys(fetchedObj).forEach((propKey) => {
        const val = fetchedObj[propKey];
        if (val !== null && val !== undefined && val !== '') {
          mergedObj[propKey] = val;
        }
      });

      mergedData[key] = mergedObj;
    });

    return mergedData;
  }

  /**
   * Safe getter method matching template references: revampFallback()?.['key']?.['prop']
   */
  revampFallback(): Record<string, Record<string, any>> {
    return this.aemData();
  }

  // Card freeze state signals
  card1Frozen = signal(false);
  card2Frozen = signal(false);
  card3Frozen = signal(false);
  isAllFrozen = false;

  // Card details visibility signals (for the eye toggle button)
  card1ShowDetails = signal(false);
  card2ShowDetails = signal(false);
  card3ShowDetails = signal(false);

  // Toggle individual card freeze status
  toggleCardFreeze(cardIndex: number): void {
    if (cardIndex === 1) {
      this.card1Frozen.update((val) => !val);
    } else if (cardIndex === 2) {
      this.card2Frozen.update((val) => !val);
    } else if (cardIndex === 3) {
      this.card3Frozen.update((val) => !val);
    }
  }

  // Freeze or unfreeze all cards at once
  toggleFreezeAllCards(): void {
    this.isAllFrozen = !this.isAllFrozen;
    this.card1Frozen.set(this.isAllFrozen);
    this.card2Frozen.set(this.isAllFrozen);
    this.card3Frozen.set(this.isAllFrozen);
  }

  // Trigger modal or workflow for ordering a new card
  openOrderCardModal(): void {
    console.log('Order New Card modal triggered.');
  }

  // Toggle sensitive details (full card number / CVV) visibility
  viewCardDetails(cardIndex: number): void {
    if (cardIndex === 1) {
      this.card1ShowDetails.update((val) => !val);
    } else if (cardIndex === 2) {
      this.card2ShowDetails.update((val) => !val);
    } else if (cardIndex === 3) {
      this.card3ShowDetails.update((val) => !val);
    }
  }
}