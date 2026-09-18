import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DASHBOARD_CONSTANTS } from '../../dashboard.constant';
import { signal, computed } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent {
  private http = inject(HttpClient);

  readonly aemData = toSignal(
    this.http.get<any>('http://localhost:4201/assets/data/aem-mock-data.json').pipe(
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

  // Helper to normalize dates to YYYY-MM-DD format
  private formatDate(dateInput: string): string {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput; // Return original if invalid
    return d.toISOString().slice(0, 10);
  }

  downloadTransactions(): void {
    const currentList = this.filteredTransactions();
    const doc = new jsPDF();

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Transaction History Report', 14, 20);

    // Subtitle / Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toISOString().slice(0, 10)}`, 14, 28);

    let y = 40;

    // Loop through filtered transactions and draw them cleanly on the PDF page
    currentList.forEach((tx, index) => {
      // Check if we need to auto-page break
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`${index + 1}. ${tx.desc}`, 14, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Category: ${tx.category}`, 20, y + 6);
      doc.text(`Date: ${tx.date}`, 20, y + 12);
      
      doc.text(`Status: ${tx.status}`, 120, y + 6);
      doc.text(`Amount: ${tx.amount}`, 120, y + 12);

      // Light separator line between list items
      y += 20;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y - 4, 196, y - 4);
      y += 4;
    });

    // Save as a true PDF document
    doc.save(`Transactions_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  searchQuery = signal('');
  startDate = signal('');
  endDate = signal('');

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  onStartDateInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.startDate.set(value);
    
    if (this.endDate() && value && this.endDate() < value) {
      this.endDate.set('');
    }
  }

  onEndDateInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.endDate.set(value);
  }

  readonly hasActiveFilters = computed(() => {
    return this.searchQuery().trim() !== '' || this.startDate() !== '' || this.endDate() !== '';
  });

  resetFilters() {
    this.searchQuery.set('');
    this.startDate.set('');
    this.endDate.set('');
  }

  private loadSavedTransactions(): any[] {
    const saved = localStorage.getItem('account_custom_transactions');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((tx: any) => ({ ...tx, date: this.formatDate(tx.date) }));
  }

  customTransactions = signal<any[]>(this.loadSavedTransactions());

  readonly filteredTransactions = computed(() => {
    const overview = this.revampFallback()['account-overview'] || {};
    
    const baseTransactions = [
      { desc: overview['tx1Desc'], category: overview['tx1Category'], date: this.formatDate(overview['tx1Date']), status: overview['tx1Status'], amount: overview['tx1Amount'], badge: 'success', positive: true },
      { desc: overview['tx2Desc'], category: overview['tx2Category'], date: this.formatDate(overview['tx2Date']), status: overview['tx2Status'], amount: overview['tx2Amount'], badge: 'success', positive: false },
      { desc: overview['tx3Desc'], category: overview['tx3Category'], date: this.formatDate(overview['tx3Date']), status: overview['tx3Status'], amount: overview['tx3Amount'], badge: 'pending', positive: false },
      { desc: overview['tx4Desc'], category: overview['tx4Category'], date: this.formatDate(overview['tx4Date']), status: overview['tx4Status'], amount: overview['tx4Amount'], badge: 'success', positive: false },
    ];

    const transactionsList = [...this.customTransactions(), ...baseTransactions];

    const query = this.searchQuery().toLowerCase().trim();
    const startTimestamp = this.startDate() ? new Date(this.startDate()).getTime() : null;
    const endTimestamp = this.endDate() ? new Date(this.endDate()).getTime() : null;

    return transactionsList.filter(tx => {
      const matchesSearch = !query || 
        tx.desc?.toLowerCase().includes(query) ||
        tx.category?.toLowerCase().includes(query) ||
        tx.status?.toLowerCase().includes(query);

      let matchesDateRange = true;
      if (tx.date) {
        const txTime = new Date(tx.date).getTime();
        if (!isNaN(txTime)) {
          if (startTimestamp !== null && txTime < startTimestamp) {
            matchesDateRange = false;
          }
          if (endTimestamp !== null && txTime > endTimestamp) {
            matchesDateRange = false;
          }
        }
      }

      return matchesSearch && matchesDateRange;
    });
  });
  
  isTransferModalOpen = false;
  transferAmount: number | null = null;
  transferRecipient = '';
  transferSuccessMessage = '';
  transferErrorMessage = '';

  openTransferModal(): void {
    this.isTransferModalOpen = true;
    this.transferAmount = null;
    this.transferRecipient = '';
    this.transferSuccessMessage = '';
    this.transferErrorMessage = '';
  }

  closeTransferModal(): void {
    this.isTransferModalOpen = false;
  }

  savingsBalance = signal(localStorage.getItem('account_savings_balance') || '₹8,200.00');
  checkingBalance = signal(localStorage.getItem('account_checking_balance') || '₹4,250.00');

  totalBalance = computed(() => {
    const savings = parseFloat(this.savingsBalance().replace(/[^0-9.-]+/g, "")) || 0;
    const checking = parseFloat(this.checkingBalance().replace(/[^0-9.-]+/g, "")) || 0;
    const total = savings + checking;
    return '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  executeTransfer(event: Event) {
    event.preventDefault();
    this.transferErrorMessage = '';
    
    const amountToSubtract = Number(this.transferAmount) || 0;
    
    if (amountToSubtract > 0) {
      let currentSavings = parseFloat(this.savingsBalance().replace(/[^0-9.-]+/g, ""));
      if (amountToSubtract > currentSavings) {
        this.transferErrorMessage = 'Insufficient funds in Savings Balance.';
        return;
      }

      let newSavings = currentSavings - amountToSubtract;
      let formattedSavings = '₹' + newSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      this.savingsBalance.set(formattedSavings);

      // Create new transaction with uniform YYYY-MM-DD date format and Rupee symbol
      const todayStr = this.formatDate(new Date().toISOString());
      const newTx = {
        desc: `Transfer to ${this.transferRecipient}`,
        category: 'Transfer',
        date: todayStr,
        status: 'Completed',
        amount: `-₹${amountToSubtract.toFixed(2)}`,
        badge: 'success',
        positive: false
      };

      const updatedTransactions = [newTx, ...this.customTransactions()];
      this.customTransactions.set(updatedTransactions);

      localStorage.setItem('account_savings_balance', formattedSavings);
      localStorage.setItem('account_checking_balance', this.checkingBalance());
      localStorage.setItem('account_custom_transactions', JSON.stringify(updatedTransactions));

      this.transferSuccessMessage = `Successfully transferred ₹${amountToSubtract} to ${this.transferRecipient}!`;
      
      setTimeout(() => {
        this.closeTransferModal();
        this.transferSuccessMessage = '';
        this.transferAmount = null;
        this.transferRecipient = '';
      }, 2000);
    }
  }
}