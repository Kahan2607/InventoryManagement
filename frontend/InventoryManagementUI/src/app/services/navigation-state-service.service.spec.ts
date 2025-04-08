import { TestBed } from '@angular/core/testing';

import { NavigationStateService } from './navigation-state-service.service';

describe('NavigationStateServiceService', () => {
  let service: NavigationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
