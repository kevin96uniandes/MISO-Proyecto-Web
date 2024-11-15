import { ChangeDetectorRef, Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { StorageService } from '../../../common/storage.service';


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
  idInvoice!: string

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private invoiceService: InvoiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isCreditCard = true
    this.idInvoice = this.route.snapshot.paramMap.get('invoice_id')!;

    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

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
    let paymentMethodId = 0

    if (this.isPse) {
      if (!this.pseForm.invalid) {
        console.log(this.pseForm)
        paymentMethodId = 1
      }else{
        this.showFormErrors(this.pseForm)
      }
    } else if (this.isCreditCard) {
      if (!this.creditCardForm.invalid) {
        console.log(this.creditCardForm)
        paymentMethodId = 2
      }else{
        this.showFormErrors(this.creditCardForm)
      }
    }
    if(paymentMethodId != 0){
      this.invoiceService.payInvoice(this.idInvoice, paymentMethodId).subscribe({
        next: (response) => {
          console.log(response)
          const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '700px',
            height: '320px',
            maxWidth: '700px',
            disableClose: true,
            data: {
              isPse: this.isPse,
              isCreditCard: this.isCreditCard,
              pseData: this.pseForm.value,
              creditCardData: this.creditCardForm.value
            }
          });
  
          dialogRef.afterClosed().subscribe({
            next: (response) => {
              this.router.navigate(['/dashboard/invoice'])
            }
           })
        }
      })
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
