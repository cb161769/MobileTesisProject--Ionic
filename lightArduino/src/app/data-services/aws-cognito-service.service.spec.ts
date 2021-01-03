import { TestBed } from '@angular/core/testing';

import { AwsCognitoServiceService } from './aws-cognito-service.service';

describe('AwsCognitoServiceService', () => {
  let service: AwsCognitoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsCognitoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
