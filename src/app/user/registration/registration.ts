import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  form: FormGroup;
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get userName() {
    return this.form.get('userName');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      this.form.get('password')?.setValue('');
      this.form.get('confirmPassword')?.setValue('');
      return;
    }

    const payload = {
      userName: this.form.value.userName,
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.http
      .post('https://localhost:7247/api/User/register', payload)
      .subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          alert('Registration successful. Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          alert('Registration failed. Try again.');
        },
      });
  }

  onClick() {
    this.router.navigate(['/login']);
  }
}
