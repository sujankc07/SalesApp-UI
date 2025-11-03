import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Customer {
  customerName: string;
  customerNumber: string;
  location: string;
  phone: string;
}

export interface Address {
  address: string;
  city: string;
  state: String;
  postalCode: string;
}
@Injectable({
  providedIn: 'root',
})
export class CustomerDetails {
  //shipping address
  private ADDRESS_KEY = 'addressKey';

  private addressSubject = new BehaviorSubject<Address | null>(
    this.loadAddress()
  );
  address$ = this.addressSubject.asObservable();

  private loadAddress(): Address | null {
    const data = localStorage.getItem(this.ADDRESS_KEY);
    return data ? JSON.parse(data) : null;
  }

  setAddress(address: Address) {
    this.addressSubject.next(address);
    localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(address));
  }

  clearAddress() {
    this.addressSubject.next(null);
    localStorage.removeItem(this.ADDRESS_KEY);
  }

  //customer details
  private STORAGE_KEY = 'customer';
  private customerSubject = new BehaviorSubject<Customer | null>(
    this.loadCustomer()
  );
  customer$ = this.customerSubject.asObservable();

  private loadCustomer(): Customer | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  setCustomer(customer: Customer) {
    this.customerSubject.next(customer);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customer));
  }

  clearCustomer() {
    this.customerSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCustomerNo() {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (data == null) {
      return null;
    }

    const customer: Customer = JSON.parse(data);

    return customer.customerNumber;
  }
}
