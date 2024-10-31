import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { Person } from '../../auth/person';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

@Component({
  selector: 'app-user-query',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './user-query.component.html',
  styleUrl: './user-query.component.scss'
})
export class UserQueryComponent {

  userQueryForm!: FormGroup

 constructor(private formBuilder: FormBuilder,
  private storageService: StorageService,
  private translate: TranslateService,
  private incidentService: IncidentService,
  private cdr: ChangeDetectorRef,
  private router: Router){}

  ngOnInit(): void { 

    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    this.userQueryForm = this.formBuilder.group({
      identityType: ["", Validators.required],
      identityNumber: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]]
    });
  }

  userQuery(){
    console.log(this.userQueryForm);
    if (!this.userQueryForm.invalid) { 
      this.incidentService.getPersonByIdentity(this.userQueryForm.get('identityType')?.value, this.userQueryForm.get('identityNumber')?.value)
      .subscribe({
        next: (person: Person) => {
          if (!person || Object.keys(person).length === 0) { 
            this.router.navigate(['/dashboard/incident']);
          }else{
            this.router.navigate(['/dashboard/ranking'], { state: { person: person } });
          }
        },
        error: (error) => {
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Se ha presentado un error a la hora de consultar el ranking del usuario',
          });
        }
      })
    }else{
      Object.values(this.userQueryForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });

      this.cdr.detectChanges()
    }
  }

}
