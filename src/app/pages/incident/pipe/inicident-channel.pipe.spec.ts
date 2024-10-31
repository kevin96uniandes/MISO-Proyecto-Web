import { TestBed } from '@angular/core/testing';
import { InicidentChannelPipe } from './inicident-channel.pipe';
import { LOCALE_ID } from '@angular/core';
import { StorageService } from '../../../common/storage.service';

describe('InicidentChannelPipe', () => {
  
  
  let pipe: InicidentChannelPipe;
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
    pipe = new InicidentChannelPipe(locale, storageServiceMock);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
