import { TestBed } from '@angular/core/testing';

import { AwsAmplifyService } from './aws-amplify.service';

describe('AwsAmplifyService', () => {
  let service: AwsAmplifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsAmplifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
