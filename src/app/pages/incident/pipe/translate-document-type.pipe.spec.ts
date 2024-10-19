import { TranslateDocumentTypePipe } from './translate-document-type.pipe';
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { StorageService } from '../../../common/storage.service';

describe('TranslateDocumentTypePipe', () => {
  let pipe: TranslateDocumentTypePipe;
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
    pipe = new TranslateDocumentTypePipe(locale, storageServiceMock);
  });

  it('debería crear la pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('debería traducir "Cédula_Cuidadania" correctamente al español', () => {
    storageServiceMock.getItem.and.returnValue('es');  
    expect(pipe.transform('1')).toBe('Cédula de Ciudadanía');
  });

  it('debería traducir "Cédula_Extrangeria" correctamente al inglés', () => {
    storageServiceMock.getItem.and.returnValue('en');  
    pipe.lang = storageServiceMock.getItem('language');
    
    expect(pipe.transform('2')).toBe('Foreigner ID');
});

  it('debería usar el idioma por defecto si no hay valor en storageService', () => {
    storageServiceMock.getItem.and.returnValue(null);  
    expect(pipe.transform('4')).toBe('Pasaporte');
  });

  it('debería devolver el valor original si no encuentra una traducción', () => {
    storageServiceMock.getItem.and.returnValue('es'); 
    expect(pipe.transform('Documento_Desconocido')).toBe('Documento_Desconocido');  
  });
});