import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterOutlet } from '@angular/router';
import { NavigationStateService } from '../navigation-state-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navState = inject(NavigationStateService);

  if (navState.hasComeFromItemsPage()) {
    return true;
  }

  router.navigate(['/items']);
  return false;
};
