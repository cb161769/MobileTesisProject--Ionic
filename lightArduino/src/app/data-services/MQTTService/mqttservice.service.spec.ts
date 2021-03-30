import { TestBed } from '@angular/core/testing';

import { MQTTServiceService } from './mqttservice.service';

describe('MQTTServiceService', () => {
  let service: MQTTServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MQTTServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
