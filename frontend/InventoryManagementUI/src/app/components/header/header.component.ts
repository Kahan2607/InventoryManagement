import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
  }

  showCategories() {
    console.log('In the categories routing');

    this.router.navigate(['/categories']);
  }

  showItems() {
    this.router.navigate(['/items']);
  }

  showSales() {
    this.router.navigate(['/sales']);
  }
}
