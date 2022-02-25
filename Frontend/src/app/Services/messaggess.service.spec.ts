import { TestBed } from '@angular/core/testing';

import { MessaggessService } from './messaggess.service';

describe('MessaggessService', () => {
  let service: MessaggessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessaggessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
