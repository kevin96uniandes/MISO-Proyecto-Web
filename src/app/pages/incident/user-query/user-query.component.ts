import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';

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
  private rankingService: IncidentService){}

  ngOnInit(): void { 
    this.userQueryForm = this.formBuilder.group({
      identityType: ["", Validators.required],
      identityNumber: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]]
    });
  }

  userQuery(){

  }

}
