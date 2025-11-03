import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../shared/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private route = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get userName() {
    return this.form.get('userName');
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    console.log(this.form.value);

    if (this.form.invalid) return;

    this.http
      .post<{ token: string }>(
        'https://localhost:7247/api/User/login',
        this.form.value
      )
      .subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          this.auth.saveToken(res.token);
          alert('Login successful');
          this.route.navigateByUrl('dashboard');
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials.');
          this.form.get('userName')?.setValue('');
          this.form.get('password')?.setValue('');
        },
      });
  }

  onRegister() {
    this.route.navigate(['/register']);
  }

  // onAuth() {
  //   const token = this.auth.getToken();
  //   if (!token) {
  //     alert('Not logged in.');
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   this.http.get('https://localhost:7247/api/User/me', { headers }).subscribe({
  //     next: (res) => {
  //       console.log('Protected data:', res);
  //     },
  //     error: (err) => {
  //       console.error('Auth failed:', err);
  //       alert('Token expired or invalid.');
  //     },
  //   });
  // }
}
