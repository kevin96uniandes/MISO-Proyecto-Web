import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFilesComponent } from './upload-files.component';
import { StorageService } from '../../../common/storage.service';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';


describe('UploadFilesComponent', () => {
  let component: UploadFilesComponent;
  let fixture: ComponentFixture<UploadFilesComponent>;
  let translateServiceMock: any;
  let translateService: any;

  beforeEach(async () => {

    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get']);
    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({})); 
    translateServiceMock.use.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [UploadFilesComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock }  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add files when a valid file is selected', () => {
    const file = new File(['content'], 'testFile.txt', { type: 'text/plain' });

    const fileEvent = {
      preventDefault: () => {}, 
      target: { files: [file] }
    } as unknown as Event;

    component.onFileSelected(fileEvent);
    expect(component.files.length).toBe(1);
    expect(component.files[0].name).toBe('testFile.txt');
  });

  it('should add files when files are dropped', () => {
    const file1 = new File(['content'], 'testFile1.txt', { type: 'text/plain' });
    const file2 = new File(['content'], 'testFile2.txt', { type: 'text/plain' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);

    const dragEvent = new DragEvent('drop', {
      dataTransfer
    });

    component.onFileDropped(dragEvent);
    expect(component.files.length).toBe(2);
    expect(component.files[0].name).toBe('testFile1.txt');
    expect(component.files[1].name).toBe('testFile2.txt');
  });

  it('should not add duplicate files', () => {
    const file1 = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    const file2 = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    
    const fileEvent = {
      preventDefault: () => {}, 
      target: { files: [file1, file2] }
    } as unknown as Event;
  
    component.onFileSelected(fileEvent);
  
    expect(component.files.length).toBe(2);
  });
  

  it('should not add a file that exceeds the maximum size', () => {

    translateServiceMock.get.and.returnValue(of({
      'FILE_SIZE_ERROR': 'El archivo excede el tamaño máximo permitido de 25 MB. <br/>',
    }));

    const largeFile = new File([new Uint8Array(component.MAX_SIZE + 1)], 'largeFile.txt', {
      type: 'text/plain'
    });
  
    const fileEvent = { 
      preventDefault: () => {}, 
      target: { files: [largeFile] } 
    } as unknown as Event;
  
    component.onFileSelected(fileEvent);
  
    expect(component.files.length).toBe(0);
  
    expect(component.errorMessage).toContain('excede el tamaño máximo permitido de 25 MB');
  });
  

  it('should remove a file from the list', () => {
    const file = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    component.files.push(file);

    component.removeFile(0);
    expect(component.files.length).toBe(0);
  });

  it('should emit the files list when a file is added or removed', () => {
    spyOn(component.filesChanged, 'emit');
  
    const file = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    const fileEvent = { 
      preventDefault: () => {}, 
      target: { files: [file] } 
    } as unknown as Event;
  
    component.onFileSelected(fileEvent);
    expect(component.filesChanged.emit).toHaveBeenCalledWith(component.files);
  
    component.removeFile(0);
    expect(component.filesChanged.emit).toHaveBeenCalledWith([]);
  });

  it('should show an error message when the file limit is exceeded', () => {

    const files = [
      new File(['content'], 'file1.txt', { type: 'text/plain' }),
      new File(['content'], 'file2.txt', { type: 'text/plain' }),
      new File(['content'], 'file3.txt', { type: 'text/plain' }),
      new File(['content'], 'file4.txt', { type: 'text/plain' })
    ];
  
    const fileEvent = { 
      preventDefault: () => {}, 
      target: { files } 
    } as unknown as Event;
  
    component.onFileSelected(fileEvent);
  
    expect(component.files.length).toBe(3); 
  });

  it('should clear the file input when removing a file', () => {
    const mockFileInput = { nativeElement: { value: '' } };
    component.fileInput = mockFileInput as any;
  
    const file = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    component.files.push(file);
  
    component.removeFile(0);
    expect(component.fileInput.nativeElement.value).toBe('');
  });
});
