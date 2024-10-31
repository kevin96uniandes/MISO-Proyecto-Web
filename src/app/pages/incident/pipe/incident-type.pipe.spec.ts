import { LOCALE_ID } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { IncidentTypePipe } from './incident-type.pipe';
import { TestBed } from '@angular/core/testing';

describe('IncidentTypePipe', () => {

  let pipe: IncidentTypePipe;
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
    pipe = new IncidentTypePipe(locale, storageServiceMock);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
