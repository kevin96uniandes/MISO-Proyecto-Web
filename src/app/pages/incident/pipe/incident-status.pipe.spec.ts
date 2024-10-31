import { TestBed } from '@angular/core/testing';
import { StorageService } from '../../../common/storage.service';
import { IncidentStatusPipe } from './incident-status.pipe';
import { LOCALE_ID } from '@angular/core';

describe('IncidentStatusPipe', () => {


  let pipe: IncidentStatusPipe;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'es' }, 
        { provide: StorageService, useValue: storageServiceMock },
      ]
    });

    const locale = TestBed.inject(LOCALE_ID);
    pipe = new IncidentStatusPipe(locale, storageServiceMock);
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
