import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  NgModel,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import {
  Address,
  Customer,
  CustomerDetails,
} from '../shared/services/customer-details';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../shared/services/auth';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { AddressComponent } from '../address-component/address-component';
import { Orders } from '../shared/services/orderService';

@Component({
  selector: 'app-parts',
  imports: [ɵInternalFormsSharedModule, FormsModule, CommonModule],
  templateUrl: './parts.html',
  styleUrl: './parts.css',
})
export class Parts implements OnInit {
  ngOnInit() {
    const token = this.auth.getToken();

    if (!token || !this.auth.isAuthenticated()) {
      alert('Session expired');
      this.router.navigate(['/login']);
      return;
    }
  }
  private http = inject(HttpClient);
  auth = inject(Auth);
  router = inject(Router);
  customerDetails = inject(CustomerDetails);
  orderDetails = inject(Orders);

  private subscription!: Subscription;
  private dialog = inject(Dialog);

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  navigateToOrder() {
    this.getShippingAddress();
    this.router.navigate(['/orders']);
  }

  addressDropDown: any;
  custID: string | null = '';
  getAddressDropdown() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.custID = this.customerDetails.getCustomerNo();

    //using conventional routing
    this.http
      .get(`https://localhost:7247/api/CustomerAddress?custNo=${this.custID}`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          this.addressDropDown = res;
          console.log(this.addressDropDown);
          this.viewOrders = false;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  selectedAddress: any;

  addNewAdd(event: any) {
    console.log(event.target.value);
    this.selectedAddress = event.target.value;
    this.partSearch = true;

    if (event.target.value == 'new') {
      this.dialog.open(AddressComponent);
    }
  }

  num: any;
  partDetails: any;
  showTable: boolean = false;

  partSearch: boolean = false;

  setPartNumber(event: any) {
    this.num = event.target.value;
  }

  searchPartByNumber() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    //using attribute routing
    this.http
      .get(`https://localhost:7247/api/Part/${this.num}`, { headers })
      .subscribe({
        next: (res) => {
          this.showTable = true;
          this.partDetails = res;
          console.log(res);
          console.log(this.partDetails);
        },
        error: (err) => {
          this.showTable = false;
          alert('Enter Valid Part #');
          this.num = '';
          console.error(err);
        },
      });
  }

  onReset() {
    this.num = '';
    this.showTable = false;
  }

  yearDropdown: any;
  getYears() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http.get('https://localhost:7247/getYear', { headers }).subscribe({
      next: (res) => {
        this.yearDropdown = res;
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  selectedYear: any = '';
  setYear(y: Event) {
    this.selectedYear = (y.target as HTMLSelectElement).value;
    console.log(this.selectedYear);
  }

  makeDropdown: any;
  getMake() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http
      .get(`https://localhost:7247/api/Part/make/${this.selectedYear}`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          this.makeDropdown = res;
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  selectedMake: any = '';
  setMake(event: any) {
    this.selectedMake = event.target.value;
    console.log(this.selectedMake);
  }

  modelDropdown: any;
  getModel() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http
      .get(`https://localhost:7247/api/Part/model/${this.selectedMake}`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.modelDropdown = res;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  selectedModel: any = '';
  setModel(event: any) {
    this.selectedModel = event.target.value;
    console.log(this.selectedModel);
  }

  searchPart() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http
      .get('https://localhost:7247/api/Part/searchPart', {
        params: {
          year: this.selectedYear,
          make: this.selectedMake,
          model: this.selectedModel,
        },
        headers,
      })
      .subscribe({
        next: (res) => {
          this.showTable = true;
          console.log(res);
          this.partDetails = [res];
        },
        error: (err) => {
          this.showTable = false;
          console.error(err);
          alert('No Part Found');
          this.onResetDropdown();
        },
      });
  }

  addToCart() {
    this.orderDetails.setOrders(this.partDetails);
    alert('Item added to cart');
  }

  onResetDropdown() {
    this.selectedYear = '';
    this.selectedMake = '';
    this.selectedModel = '';
    this.showTable = false;
  }

  //getting shipping address
  getShippingAddress() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http
      .get<Address>(
        `https://localhost:7247/api/CustomerAddress/getShippingAddress`,
        {
          params: { address: this.selectedAddress },
          headers,
        }
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.customerDetails.setAddress(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  viewOrders: boolean = false;

  orderList: any;
  filteredOrders: any;
  getOrders() {
    const token = this.auth.getToken();

    if (!token) {
      alert('No token found. Please log in.');
      //this.router.navigate(['/login']);
      return;
    }

    if (this.auth.isTokenExpired(token)) {
      alert('Session expired. Log in');
      this.router.navigate(['/login']);
    }

    const custNum = this.customerDetails.getCustomerNo();
    // this.http
    //   .get(`https://localhost:7247/api/Order/getOrders?custNo=${custNum}`, {
    //     headers,
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       console.log('OrderList: ', res);
    //       this.viewOrders = !this.viewOrders;
    //       this.partSearch = false;
    //       this.showTable = false;
    //       this.orderList = res;
    //       this.filteredOrders = res;
    //     },
    //     error: (err) => {
    //       alert('No Previous Orders');
    //       console.error(err);
    //     },
    //   });

    //soap endpoint
    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://tempuri.org/IOrderSoapService/GetOrders',
    };

    const xmlBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:GetOrders>
            <tem:custNo>${custNum}</tem:custNo>
          </tem:GetOrders>
        </soap:Body>
      </soap:Envelope>
    `;
    this.http
      .post('https://localhost:7247/soap/OrderService', xmlBody, {
        headers,
        responseType: 'text',
      }) // get raw XML as text
      .subscribe({
        next: (res) => {
          this.orderList = this.parseXmlToJson(res);
          this.filteredOrders = this.orderList;
          this.viewOrders = !this.viewOrders;
          this.partSearch = false;
          this.showTable = false;

          if (this.filteredOrders.length == 0) {
            this.viewOrders = false;
            alert('No Previous Orders');
          }

          console.log(this.filteredOrders);
        },
        error: (err) => {
          alert('No Previous Orders');
          console.error(err);
        },
      });
  }

  term: string = '';

  searchTerm(event: any) {
    this.term = event.target.value;
    this.searchFromRetrievedOrders();
    console.log(this.term);
  }

  searchFromRetrievedOrders() {
    const lower = this.term;
    // this.filteredOrders = this.orderList.filter(
    //   (p: any) =>
    //     p.partNumber.toLowerCase().includes(lower) ||
    //     p.partName.toLowerCase().includes(lower) ||
    //     p.make.toLowerCase().includes(lower) ||
    //     p.model.toLowerCase().includes(lower) ||
    //     p.year.toString().includes(lower)
    // );

    //data converted from xml search
    this.filteredOrders = this.orderList.filter((p: any) => {
      // const search = lower.toLowerCase();
      return (
        p.PartNumber.toLowerCase().includes(lower) ||
        p.PartName.toLowerCase().includes(lower) ||
        p.Make.toLowerCase().includes(lower) ||
        p.Model.toLowerCase().includes(lower) ||
        p.Year.toString().includes(lower)
      );
    });
    console.log(this.filteredOrders);
  }

  //xml to json
  parseXmlToJson(xmlStr: any): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');

    console.log('XML DOc - ', xmlDoc);

    // Extract all <OrderData> nodes
    const orderNodes = xmlDoc.getElementsByTagName('OrderData');
    const orders: any[] = [];

    for (let i = 0; i < orderNodes.length; i++) {
      const order = orderNodes[i];
      const obj = {
        Make: order.getElementsByTagName('Make')[0]?.textContent || '',
        Model: order.getElementsByTagName('Model')[0]?.textContent || '',
        PartName: order.getElementsByTagName('PartName')[0]?.textContent || '',
        PartNumber:
          order.getElementsByTagName('PartNumber')[0]?.textContent || '',
        Price: order.getElementsByTagName('Price')[0]?.textContent || '',
        Year: order.getElementsByTagName('Year')[0]?.textContent || '',
      };

      console.log(obj);

      orders.push(obj);
    }

    console.log('Converted JSON:', orders);
    return orders;
  }
}
