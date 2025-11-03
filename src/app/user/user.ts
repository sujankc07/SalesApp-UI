import { Component } from '@angular/core';
import { Registration } from './registration/registration';
import { Login } from './login/login';

@Component({
  selector: 'app-user',
  imports: [Registration, Login],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {}
