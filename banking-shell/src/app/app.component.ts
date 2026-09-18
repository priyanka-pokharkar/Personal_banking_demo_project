import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, exhaustMap, finalize } from 'rxjs/operators';
import { of, EMPTY, Subject, Subscription } from 'rxjs';
import { MockApiInterceptor } from './mock-api.interceptor';
import {
  DASHBOARD_CONSTANTS,
  NAV_LINKS,
  FINANCIAL_METRICS,
  PROMO_BANNERS,
  NavigationLink,
  MetricCard,
  BannerPromo,
} from './dashboard.constants';

export interface BankingService {
  name: string;
  fee: number;
}

export interface SanitizedNavLink extends Omit<NavigationLink, 'iconSvg'> {
  safeIconSvg: SafeHtml;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  // Expose Constants & Banners
  readonly constants = DASHBOARD_CONSTANTS;
  readonly banners: BannerPromo[] = PROMO_BANNERS;

  /**
   * Fetches AEM JSON data, maps it into a dictionary, and converts the Observable stream 
   * directly into a Signal with DASHBOARD_CONSTANTS as the fallback initial value.
   */
  readonly aemData = toSignal(
    this.http.get<any>('assets/data/aem-mock-data.json').pipe(
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

  // Sanitized SVG links
  readonly navLinks: SanitizedNavLink[] = NAV_LINKS.map((link) => ({
    ...link,
    safeIconSvg: this.sanitizer.bypassSecurityTrustHtml(link.iconSvg),
  }));

  // Dynamic Data fetched via Mock API
  metrics: MetricCard[] = FINANCIAL_METRICS;
  isLoading = false;

  // Application State
  isCartOpen = false;
  selectedServices: BankingService[] = [];

  // Property to track active success banners/popups in the UI
  activeSuccessMessage: string | null = null;

  isAuthenticated = !!localStorage.getItem('auth_token');
  loginUsername = '';
  loginPassword = '';
  loginError = '';

  private loginTrigger$ = new Subject<{ username: string; password: string }>();
  private logoutTrigger$ = new Subject<void>();
  private subscription = new Subscription();

  ngOnInit(): void {
    // Setup exhaustMap stream for Login with catchError to keep the stream alive on failure
    this.subscription.add(
      this.loginTrigger$.pipe(
        exhaustMap((credentials) => 
          this.http.post<any>('/api/login', credentials).pipe(
            catchError((err) => {
              this.loginError = 'Invalid credentials. Please try again.';
              console.error('Login error:', err);
              return EMPTY; // Prevents the main stream from dying on invalid credentials
            }),
            finalize(() => this.isLoading = false)
          )
        )
      ).subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('current_user', JSON.stringify(response.user));
            
            this.isAuthenticated = true;
            this.loginError = '';
            this.router.navigate(['/account-overview']);
          }
        }
      })
    );

    // Setup exhaustMap stream for Logout
    this.subscription.add(
      this.logoutTrigger$.pipe(
        exhaustMap(() => 
          this.http.post<any>('/api/logout', {}).pipe(
            finalize(() => {
              this.isLoading = false;
              localStorage.removeItem('auth_token');
              localStorage.removeItem('current_user');
              this.isAuthenticated = false;
              this.loginUsername = '';
              this.loginPassword = '';
              this.loginError = '';
              this.router.navigate(['/']);
            })
          )
        )
      ).subscribe()
    );
  }

  /**
   * Computes merged dataset combining local constants with fetched AEM data
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

  revampFallback(): Record<string, Record<string, any>> {
    return this.aemData();
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  addService(name: string, fee: number): void {
    this.selectedServices.push({ name, fee });
  }

  removeService(index: number): void {
    this.selectedServices.splice(index, 1);
  }

  getTotalFees(): number {
    return this.selectedServices.reduce((sum, item) => sum + item.fee, 0);
  }

  checkoutRequests(): void {
    if (this.selectedServices.length === 0) return;

    const payload = {
      items: this.selectedServices,
      totalAmount: this.getTotalFees(),
      requestedAt: new Date().toISOString(),
    };

    this.http
      .post<{ success: boolean; transactionId: string; message: string }>(
        '/api/requests/checkout',
        payload
      )
      .subscribe({
        next: (res) => {
          alert(`${res.message}\nReference ID: ${res.transactionId}`);
          this.selectedServices = [];
          this.isCartOpen = false;
        },
        error: () => alert('Failed to process requests. Please try again.'),
      });
  }

  /**
   * Triggers the UI success message popup without navigating anywhere
   */
  triggerSuccess(message: string): void {
    this.activeSuccessMessage = message;

    // Optional auto-dismiss after 6 seconds
    setTimeout(() => {
      if (this.activeSuccessMessage === message) {
        this.activeSuccessMessage = null;
      }
    }, 6000);
  }

  login(event: Event): void {
    event.preventDefault();
    this.loginError = '';

    const username = this.loginUsername.trim();
    const password = this.loginPassword.trim();

    if (!username && !password) {
      this.loginError = 'Username and password are required.';
      return;
    }
    
    if (!username) {
      this.loginError = 'Please enter your username.';
      return;
    }

    if (!password) {
      this.loginError = 'Please enter your password.';
      return;
    }

    if (password.length < 4) {
      this.loginError = 'Password must be at least 4 characters long.';
      return;
    }

    this.isLoading = true;
    this.loginTrigger$.next({ username, password });
  }

  logout(): void {
    this.isLoading = true;
    this.logoutTrigger$.next();
    localStorage.removeItem('account_total_balance');
    localStorage.removeItem('account_savings_balance');
    localStorage.removeItem('account_custom_transactions');
    localStorage.removeItem('account_checking_balance');
  }



  offer1Activated: boolean = false;
  offer2Activated: boolean = false;
  offer3Activated: boolean = false;

  activateOffer(offerNumber: number, message: string) {
    if (offerNumber === 1) this.offer1Activated = true;
    if (offerNumber === 2) this.offer2Activated = true;
    if (offerNumber === 3) this.offer3Activated = true;
    
    this.activeSuccessMessage = message;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}