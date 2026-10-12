/**
 * CurrencyModel
 * Manages currency selection and price conversions (USD, EUR, GBP).
 */
window.Khyber = window.Khyber || {};

window.Khyber.CurrencyModel = class CurrencyModel {
  static RATES = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 }
  };

  constructor() {
    this.current = 'USD';
    try {
      this.current = localStorage.getItem('khyber_currency') || 'USD';
    } catch (e) {}
    this.bindSelector();
  }

  bindSelector() {
    document.addEventListener('DOMContentLoaded', () => {
      const selects = document.querySelectorAll('#currency-select');
      selects.forEach(sel => {
        sel.value = this.current;
        sel.addEventListener('change', (e) => {
          this.setCurrency(e.target.value);
        });
      });
    });
  }

  setCurrency(curr) {
    if (CurrencyModel.RATES[curr]) {
      this.current = curr;
      try {
        localStorage.setItem('khyber_currency', curr);
      } catch (e) {}
      // Sync all dropdowns
      document.querySelectorAll('#currency-select').forEach(sel => sel.value = curr);
      window.dispatchEvent(new CustomEvent('khyber:currency-change', { detail: { currency: curr } }));
    }
  }

  format(amountInUSD) {
    const config = CurrencyModel.RATES[this.current] || CurrencyModel.RATES.USD;
    const converted = amountInUSD * config.rate;
    return `${config.symbol}${converted.toFixed(2)}`;
  }
};

window.Khyber.currency = new window.Khyber.CurrencyModel();
