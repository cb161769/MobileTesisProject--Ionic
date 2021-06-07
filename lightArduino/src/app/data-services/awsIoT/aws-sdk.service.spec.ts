import { TestBed } from '@angular/core/testing';

import { AwsSdkService } from './aws-sdk.service';

describe('AwsSdkService', () => {
  let service: AwsSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
