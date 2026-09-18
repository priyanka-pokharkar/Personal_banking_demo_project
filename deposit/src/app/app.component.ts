import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // 1. Import Router
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DEPOSIT_CONSTANTS } from './constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private http = inject(HttpClient);
  readonly router = inject(Router); // 2. Inject Router here

  /**
   * Fetches AEM JSON data, maps it into a dictionary, and converts the Observable stream 
   * directly into a Signal with DEPOSIT_CONSTANTS as the fallback initial value.
   */
  readonly aemData = toSignal(
    this.http.get<any>('http://localhost:4203/assets/data/aem-mock.json').pipe(
      map((response) => {
        const screenContent = response?.content?.[0]?.screenContent;
        if (!Array.isArray(screenContent)) {
          return DEPOSIT_CONSTANTS;
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
        return of(DEPOSIT_CONSTANTS);
      })
    ),
    { initialValue: DEPOSIT_CONSTANTS }
  );

  /**
   * Computes merged dataset combining local constants with fetched AEM data
   * while protecting fallback values from being overridden by empty strings, null, or undefined.
   */
  private computeRevampFallback(
    fetchedData: Record<string, Record<string, any>>
  ): Record<string, Record<string, any>> {
    const mergedData: Record<string, Record<string, any>> = {};
    const keys = new Set([...Object.keys(DEPOSIT_CONSTANTS), ...Object.keys(fetchedData)]);

    keys.forEach((key) => {
      const localObj = DEPOSIT_CONSTANTS[key] || {};
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

  // Navigation Tabs: 'fd' | 'rd' | 'savings'
  activeTab: string = 'fd';

  // Feedback Messages
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  // --- Fixed Deposit (FD) State ---
  fdAmount: number = 50000;
  fdTenureYears: number = 1;
  fdInterestRate: number = 7.2; // Annual Interest Rate %
  
  // --- Recurring Deposit (RD) State ---
  rdMonthlyAmount: number = 5000;
  rdTenureMonths: number = 12;
  rdInterestRate: number = 6.8; // Annual Interest Rate %

  // --- Savings Top-up State ---
  savingsAmount: number | null = null;
  selectedAccount: string = 'savings_primary';

  // Mock Account Balances & Portfolios
  accounts: { [key: string]: { name: string; balance: number; number: string } } = {
    savings_primary: { name: 'Primary Savings A/c', balance: 84550.25, number: 'XXXX-XXXX-8921' },
    savings_salary: { name: 'Salary Account', balance: 142000.00, number: 'XXXX-XXXX-3310' }
  };

  activeFDs = [
    { fdNumber: 'FD-98214', principal: 100000, tenure: '2 Years', rate: '7.5%', maturityAmount: 116000, date: '12 Jan 2025' },
    { fdNumber: 'FD-44102', principal: 25000, tenure: '1 Year', rate: '7.1%', maturityAmount: 26825, date: '15 Aug 2025' }
  ];

  activeRDs = [
    { rdNumber: 'RD-65120', monthlyAmt: 5000, tenure: '12 Months', rate: '6.8%', maturityAmount: 62200, date: '01 Mar 2026' }
  ];

  // --- Calculations ---
  get calculatedFDMaturity(): number {
    const p = this.fdAmount || 0;
    const r = this.fdInterestRate / 100;
    const t = this.fdTenureYears;
    const n = 4;
    const amount = p * Math.pow(1 + r / n, n * t);
    return Math.round(amount);
  }

  get calculatedRDMaturity(): number {
    const p = this.rdMonthlyAmount || 0;
    const n = this.rdTenureMonths;
    const r = this.rdInterestRate / 100;
    const interest = p * (n * (n + 1) / 2) * (r / 12);
    return Math.round((p * n) + interest);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // --- Form Submissions ---
  bookFD(): void {
    if (this.fdAmount < 5000) {
      this.errorMessage = 'Minimum Fixed Deposit amount is ₹5,000.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    
    setTimeout(() => {
      const newFD = {
        fdNumber: 'FD-' + Math.floor(10000 + Math.random() * 90000),
        principal: this.fdAmount,
        tenure: `${this.fdTenureYears} Year${this.fdTenureYears > 1 ? 's' : ''}`,
        rate: `${this.fdInterestRate}%`,
        maturityAmount: this.calculatedFDMaturity,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      this.activeFDs.unshift(newFD);
      this.successMessage = `Fixed Deposit of ₹${this.fdAmount.toLocaleString('en-IN')} successfully booked!`;
      this.isLoading = false;
    }, 1000);
  }

  bookRD(): void {
    if (this.rdMonthlyAmount < 1000) {
      this.errorMessage = 'Minimum monthly installment for Recurring Deposit is ₹1,000.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const newRD = {
        rdNumber: 'RD-' + Math.floor(10000 + Math.random() * 90000),
        monthlyAmt: this.rdMonthlyAmount,
        tenure: `${this.rdTenureMonths} Months`,
        rate: `${this.rdInterestRate}%`,
        maturityAmount: this.calculatedRDMaturity,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      this.activeRDs.unshift(newRD);
      this.successMessage = `Recurring Deposit of ₹${this.rdMonthlyAmount.toLocaleString('en-IN')}/month successfully opened!`;
      this.isLoading = false;
    }, 1000);
  }

  depositSavings(): void {
    if (!this.savingsAmount || this.savingsAmount <= 0) {
      this.errorMessage = 'Please enter a valid deposit amount.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.accounts[this.selectedAccount].balance += this.savingsAmount!;
      this.successMessage = `Successfully added ₹${this.savingsAmount?.toLocaleString('en-IN')} to your ${this.accounts[this.selectedAccount].name}.`;
      this.savingsAmount = null;
      this.isLoading = false;
    }, 1000);
  }

  test(){
    
  }
}