import { DialogRef } from '@angular/cdk/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerDetails } from '../shared/services/customer-details';
import { Auth } from '../shared/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-component',
  imports: [ReactiveFormsModule],
  templateUrl: './address-component.html',
  styleUrl: './address-component.css',
})
export class AddressComponent {
  addressForm: FormGroup;
  auth = inject(Auth);
  router = inject(Router);
  dialog = inject(DialogRef);
  http = inject(HttpClient);
  custDetails = inject(CustomerDetails);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addressForm.invalid) return;

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
    console.log('Form Value:', this.addressForm.value);
    console.log(this.custDetails.getCustomerNo());
    const params = new HttpParams()
      .set('custNo', this.custDetails.getCustomerNo() ?? '')
      .set('address', this.addressForm.get('address')?.value ?? '')
      .set('city', this.addressForm.get('city')?.value ?? '')
      .set('state', this.addressForm.get('state')?.value ?? '')
      .set('postalCode', this.addressForm.get('postalCode')?.value ?? '');
    this.http
      .post(
        'https://localhost:7247/api/CustomerAddress/addAddress',
        {},
        {
          headers,
          params,
        }
      )
      .subscribe({
        next: (res) => {
          console.log('backend' + res);
          alert('Address Updated');
          this.dialog.close();
        },
        error: (err) => {
          console.error(err.err);
        },
      });
  }
}
