import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Orders {
  orders: any[] = [];
  totalPrice: number = 0;

  setOrders(val: any) {
    this.orders.push(val);
    console.log('Cart updated:', this.orders);
  }

  getOrders() {
    console.log(this.orders.flat());
    return this.orders.flat();
  }

  getTotalPrice() {
    this.totalPrice = this.orders
      .flat()
      .reduce((sum, part) => sum + part.price, 0);
    console.log('total p- ', this.totalPrice);
    return this.totalPrice;
  }
}
