import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { Person } from '../../auth/person';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-query',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './user-query.component.html',
  styleUrl: './user-query.component.scss'
})
export class UserQueryComponent {

  userQueryForm!: FormGroup

 constructor(private formBuilder: FormBuilder,
  private incidentService: IncidentService,
  private router: Router){}

  ngOnInit(): void { 
    this.userQueryForm = this.formBuilder.group({
      identityType: ["", Validators.required],
      identityNumber: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]]
    });
  }

  userQuery(){
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
        Swal.fire({
          icon: 'error',
          title: 'Se ha presentado un error a la hora de consultar el ranking del usuario',
        });
      }
    })
  }

}
