import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [
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
          this.errorMessage += `El archivo ${file.name} excede el tamaño máximo permitido de 25 MB. <br/> `;
          return false;
        }
        return true;
      });

      this.files.push(...lengthValidFiles);
      this.emitFiles();
    }else{
      this.errorMessage += `Has superado el limite de archivos por incidente`;
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
