import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in sessionStorage', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value);

    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBe(value);
  });

  it('should get an item from sessionStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    sessionStorage.setItem(key, value);

    const retrievedValue = service.getItem(key);
    expect(retrievedValue).toBe(value);
  });

  it('should return null for a non-existing item', () => {
    const key = 'nonExistingKey';

    const retrievedValue = service.getItem(key);
    expect(retrievedValue).toBeNull();
  });

  it('should clear sessionStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    sessionStorage.setItem(key, value);

    service.clear();

    const storedValue = sessionStorage.getItem(key);
    expect(storedValue).toBeNull();
  });

  it('should return null when sessionStorage.getItem throws an error', () => {
    spyOn(sessionStorage, 'getItem').and.throwError('Error retrieving item');

    const result = service.getItem('someKey');
    expect(result).toBeNull();
  });
});
