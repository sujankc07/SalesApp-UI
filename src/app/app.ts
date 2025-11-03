import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Parts } from './parts/parts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SalesApp');
}
