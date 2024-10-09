import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { StorageService } from '../common/storage.service';
import { jwtInterceptor } from './jwt.service';

describe('jwtInterceptor', () => {
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['getItem']);
    storageService.getItem.and.returnValue('test-token');

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService },
      ],
    });
  });

  it('should add Authorization header', () => {
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');

      const next: any = {
        handle: (req: HttpRequest<any>) => {
          expect(req.headers.get('Authorization')).toBe('Bearer test-token');
          return { subscribe: () => {} }; // Simulación de la función `next`
        }
      };

      jwtInterceptor(req, next.handle);
    });
  });
});
