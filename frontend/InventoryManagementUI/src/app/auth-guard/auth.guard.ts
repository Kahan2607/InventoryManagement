import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterOutlet } from '@angular/router';
import { NavigationStateService } from '../services/navigation-state-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navState = inject(NavigationStateService);

  if (navState.hasComeFromItemsPage() || navState.hasComeFromSalesPage()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
