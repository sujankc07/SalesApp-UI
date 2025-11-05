import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { CustomerDetails } from '../shared/services/customer-details';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Orders } from '../shared/services/orderService';
import { Auth } from '../shared/services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit {
  ngOnInit() {
    const token = this.auth.getToken();

    if (!token || !this.auth.isAuthenticated()) {
      alert('Session expired');
      this.router.navigate(['/login']);
      return;
    }

    this.displayOrders();
  }

  http = inject(HttpClient);
  auth = inject(Auth);
  router = inject(Router);
  orderDetails = inject(Orders);
  customerDetails = inject(CustomerDetails);
  orders: any;

  res: number = 0;

  totalPrice: number = 0;
  displayOrders() {
    this.orders = this.orderDetails.getOrders();
    this.totalPrice = this.orderDetails.getTotalPrice();
  }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  navigateToParts() {
    this.router.navigate(['/parts']);
  }

  logout() {
    this.auth.logout();
  }

  confirmOrder() {
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

    // const headers = {
    //   Authorization: `Bearer ${token}`,
    // };
    // const requestBody = {
    //   orders: this.orders,
    // };

    const custNo = this.customerDetails.getCustomerNo();
    // this.http
    //   .post(
    //     `https://localhost:7247/api/Order/saveOrder?custNo=${custNo}`,
    //     requestBody,
    //     {
    //       headers,
    //     }
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       alert('Order Confirmed!');

    //       console.log('Orders-', this.orders);
    //     },
    //     error: (err) => {
    //       console.error(err);
    //     },
    //   });
    // console.log(this.orders);

    //soap Endpoint
    const OrderXml = this.orders
      .map(
        (o: any) => `<tem:OrderData>
        <tem:PartNumber>${o.partNumber}</tem:PartNumber>
        <tem:PartName>${o.partName}</tem:PartName>
        <tem:Year>${o.year}</tem:Year>
        <tem:Make>${o.make}</tem:Make>
        <tem:Model>${o.model}</tem:Model>
        <tem:Price>${o.price}</tem:Price>
      </tem:OrderData>`
      )
      .join('');

    const soapBody = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
        <tem:SaveOrder>
        <tem:custNo>${custNo}</tem:custNo>
            <tem:request>
              <tem:orders>
                ${OrderXml}
              </tem:orders>
            </tem:request>
          </tem:SaveOrder>
        </soap:Body>
      </soap:Envelope>
    `;

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://tempuri.org/IOrderSoapService/SaveOrderAsync',
    };
    console.log(headers);
    console.log(this.orders);

    this.http
      .post('https://localhost:7247/soap/OrderService', soapBody, {
        headers,
        responseType: 'text',
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          alert('Order Confirmed!');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
