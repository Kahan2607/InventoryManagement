import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { Auth0Component } from './auth0/auth0.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { authGuard } from './auth-guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('./auth0/auth0.component').then((m) => m.Auth0Component); // lazy loading of the auth0 component
    },
  },
  {
    path: 'home',
    loadComponent: () => {
      return import('./home/home.component').then((m) => m.HomeComponent); // lazy loading
    },
  },
  {
    path: 'categories',
    loadComponent: () => {
      return import('./category/category.component').then(
        (m) => m.CategoryComponent
      );
    },
  },
  {
    path: 'items',
    loadComponent: () => {
      return import('./item/item.component').then((m) => m.ItemComponent);
    },
  },
  {
    path: 'items/add-item',
    loadComponent: () => {
      return import('./components/add-item/add-item.component').then(
        (m) => m.AddItemComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'items/update-item',
    loadComponent: () => {
      return import('./components/add-item/add-item.component').then(
        (m) => m.AddItemComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    loadComponent: () => {
      return import('./sale/sale.component').then((m) => m.SaleComponent);
    },
  },
  {
    path: 'sales/add-sales',
    loadComponent: () => {
      return import('./components/add-sale/add-sale.component').then(
        (m) => m.AddSaleComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'sales/update-sales',
    loadComponent: () => {
      return import('./components/add-sale/add-sale.component').then(
        (m) => m.AddSaleComponent
      );
    },
    canActivate: [authGuard],
  },
];
