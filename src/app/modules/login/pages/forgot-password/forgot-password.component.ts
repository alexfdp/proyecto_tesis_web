import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceService } from '../../services/login-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  public myForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginAuth: LoginServiceService,) {

  }

  ngOnInit(): void {
    this.myForm = this.createMyForm();
  }

  submitFormulario() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.procesarEmail(this.myForm.controls['email'].value);
  }

  procesarEmail(correo: string) {
    this.loginAuth.forgotPassword(correo).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Correo validado',
          text: 'Se ha enviado a su correo su usuario y contraseña',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error: (response) => {
        var msg = response["error"]["message"]
        Swal.fire({
          title: 'Error al validar correo',
          text: 'Error: ' + msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.log("Error de la API: " + msg);
      }
    })
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  public get f(): any {
    return this, this.myForm.controls;
  }
}
