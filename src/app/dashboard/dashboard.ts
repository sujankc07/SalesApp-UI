import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../shared/services/auth';
import { Customer, CustomerDetails } from '../shared/services/customer-details';
import { Parts } from '../parts/parts';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(Auth);
  customerDetails = inject(CustomerDetails);

  ngOnInit() {
    const token = this.auth.getToken();

    if (!token || !this.auth.isAuthenticated()) {
      alert('Session expired');
      this.router.navigate(['/login']);
      return;
    }
  }

  onLogout() {
    this.auth.logout();
  }

  selectColumn: string[] = [
    'all:',
    'lob:',
    'customerNumber:',
    'location:',
    'customerName:',
    'phone:',
    'address:',
    'city:',
    'state:',
    'postalCode:',
  ];

  val: string = '';
  onSearch(event: any) {
    this.val = event.target.value;
    console.log('onsearch-', this.val);
  }

  selected: string = '';
  selectedColumn(val: string) {
    this.selected = val;
    console.log('selected column', this.selected);
  }

  showitems: boolean = false;
  toggelDropdown() {
    this.showitems = !this.showitems;
  }

  //checkbox
  active: boolean = false;
  isActive: string = '';
  activeLabelChange(event: any) {
    console.log(event.target.checked);
    this.active = event.target.checked;

    if (this.active) {
      this.isActive = 'active';
      this.dead = false;
    } else {
      this.isActive = '';
    }

    this.fetchData();
  }

  dead: boolean = false;
  deadLabelChange(event: any) {
    console.log(event.target.checked);
    this.dead = event.target.checked;

    if (this.dead) {
      this.isActive = 'dead';
      this.active = false;
    } else {
      this.isActive = '';
    }

    this.fetchData();
  }

  hideItems() {
    setTimeout(() => {
      this.showitems = false;
    }, 150);
  }

  //searching data
  searchResult: any;
  order: boolean = false;

  //pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalRecords: number = 0;
  currentPage: number = 1;

  pageItems = [5, 10, 25, 50];

  setPagesize(val: any) {
    this.pageSize = val;
    console.log(val);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.fetchData();
  }

  displayTable: boolean = false;

  fetchData() {
    const token = this.auth.getToken();

    if (!token) {
      alert('Please Log In Again.');
      //this.router.navigate(['/login']);
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (!this.val || this.val.trim() == '') {
      alert('Please enter a search value.');
      return;
    }

    this.http
      .get<any>('https://localhost:7247/api/Customer/search', {
        params: {
          q: this.val,
          sortCol: this.column,
          order: this.order.toString(),
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          isActive: this.isActive,
        },
        headers,
      })
      .subscribe({
        next: (res) => {
          this.displayTable = true;
          this.searchResult = res.data;
          this.selected = '';
          this.totalPages = res.totalPages;
          this.totalRecords = res.totalRecords;
          this.currentPage = res.currentPage;
          console.log(res);
        },
        error: (err) => {
          alert('No records found!');
          console.error(err);
          this.selected = '';
          this.searchResult = [];
          this.totalPages = 0;
          this.totalRecords = 0;
          this.currentPage = 1;
        },
      });
  }

  column: string = '';
  sortColumn(col: string) {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.column = col;
    this.order = !this.order;
    this.http
      .get<any>('https://localhost:7247/api/Customer/search', {
        params: {
          q: this.val,
          sortCol: this.column,
          order: this.order.toString(),
          isActive: this.isActive,
        },
        headers,
      })
      .subscribe({
        next: (res) => {
          this.searchResult = res.data;
        },
        error: (err) => {
          alert('Unable to sort data.');
          console.error(err);
        },
      });
  }

  getDetails(id: number) {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('login session expired');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http
      .get<Customer>(`https://localhost:7247/api/Customer/${id}`, { headers })
      .subscribe({
        next: (res) => {
          console.log('cs-', res);
          this.customerDetails.setCustomer(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
    this.router.navigate(['/parts']);
  }
}
