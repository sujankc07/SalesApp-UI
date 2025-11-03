import { TestBed } from '@angular/core/testing';

import { CustomerDetails } from './customer-details';

describe('CustomerDetails', () => {
  let service: CustomerDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
