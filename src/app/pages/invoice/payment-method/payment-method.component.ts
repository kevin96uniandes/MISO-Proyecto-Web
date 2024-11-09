import { ChangeDetectorRef, Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent {

  creditCardForm!: FormGroup
  pseForm!: FormGroup
  isPse!: boolean
  isCreditCard!: boolean

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.isCreditCard = true

    this.creditCardForm = this.formBuilder.group({
      creditCardNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16), Validators.pattern('^[0-9]*$')]],
      ownerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.cvvSizeValidator()]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), this.expirationDateValidator()]]
    })

    this.pseForm = this.formBuilder.group({
      ownerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      identityType: ['', Validators.required],
      identityNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      personType: ['', Validators.required],
      bank: ['', Validators.required]
    })
  }

  cvvSizeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      console.log(value.length)
      if (value.length != 3) {
        return { invalidLength: true };
      }
      return null
    }
  }

  expirationDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      const [month, year] = value.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { dateInPast: true };
      }

      return null;
    }

  }

  onPseChange(event: any) {
    if (event.checked) {
      this.isCreditCard = false
    }
  }

  onCreditCardChange(event: any) {
    if (event.checked) {
      this.isPse = false
    }
  }

  payInvoice() {
    if (this.isPse) {
      if (!this.pseForm.invalid) {
        console.log(this.pseForm)
      }else{
        this.showFormErrors(this.pseForm)
      }
    } else if (this.isCreditCard) {
      if (!this.creditCardForm.invalid) {
        console.log(this.creditCardForm)
      }else{
        this.showFormErrors(this.creditCardForm)
      }
    }
  }

  showFormErrors(form: FormGroup){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    this.cdr.detectChanges()
  }
  
}
