import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss'
})
export class UploadFilesComponent {
  files: File[] = [];
  errorMessage = ''
  MAX_SIZE = 25 * 1024 * 1024;
  LIMIT_SIZE = 3

  @Output() filesChanged = new EventEmitter<File[]>();
  @ViewChild('fileInput') fileInput!: any;

  constructor(
    private storageService: StorageService,
    private translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')
  }

  onFileSelected(event: Event) {
    event.preventDefault();

    let fileEvent = event.target as HTMLInputElement;
    if (fileEvent.files) {
     this.addFiles(fileEvent.files);
    }
  }

  onFileDropped(event: DragEvent) {
    console.log(event)
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  addFiles(files: FileList){

    this.errorMessage = '';

    if(this.files.length < 3){
      const newFiles = Array.from(files).slice(0, this.LIMIT_SIZE);

      const uniqueFiles = newFiles.filter(file => 
        !this.files.some(existingFile => 
          existingFile.name === file.name && existingFile.type === file.type
        )
      );

      const lengthValidFiles = uniqueFiles.filter(file => {

        if(file.size >= this.MAX_SIZE){

          this.translate.get(['FILE_SIZE_ERROR'], { fileName: file.name}).subscribe(translations => {
            this.errorMessage += translations['FILE_SIZE_ERROR']
          });

          return false;
        }
        return true;
      });

      this.files.push(...lengthValidFiles);
      this.emitFiles();
    }else{
      this.translate.get(['FILE_LIMIT_EXCEEDED']).subscribe(translations => {
        this.errorMessage += translations['FILE_LIMIT_EXCEEDED']
      });
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.emitFiles();
    this.clearFileInput()
  }

  emitFiles(){
    this.filesChanged.emit(this.files);
  }

  clearFileInput() {
    this.fileInput.nativeElement.value = ''; 
  }
}
