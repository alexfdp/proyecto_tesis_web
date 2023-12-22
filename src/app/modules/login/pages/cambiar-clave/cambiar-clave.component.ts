import { Component, ElementRef, Inject, inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss']
})
export class CambiarClaveComponent {

  @ViewChild('inputPass1') inputPass1!: ElementRef;
  @ViewChild('inputPass') inputPass!: ElementRef;
  @ViewChild('btnEyePass') btnEyePass!: ElementRef;
  @ViewChild('btnEyePass_1') btnEyePass_1!: ElementRef;
  public myForm!: FormGroup;
  val = true;
  iconName = 'bootstrapEyeFill';
  iconName2 = 'bootstrapEyeFill';

  constructor(private routerprd: Router, private fb: FormBuilder,
    private renderer: Renderer2, private loginAuth: LoginServiceService,
  ) {
    this.myForm = this.createMyForm();
    this.myForm.get('contrasena_1')!.statusChanges.subscribe(() => {
      this.condicionales();
    });
    this.myForm.get('contrasena')!.statusChanges.subscribe(() => {
      this.condicionales();
    });
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('estate');
    this.routerprd.navigateByUrl("/login")
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      contrasena_1: ['', [Validators.required, Validators.minLength(1)]],
      contrasena: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  cambioPassEvent(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const contrasena = this.myForm.get('contrasena_1')?.value
    console.log("cambio contrasena: " + filterValue)
    if (filterValue === contrasena) {
      this.val = true
    } else {
      this.val = false
    }
    this.condicionales()
  }

  cambioPassEvent_1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const contrasena = this.myForm.get('contrasena')?.value
    console.log("cambio contrasena_1: " + filterValue)
    if (filterValue === contrasena) {
      this.val = true
    } else {
      this.val = false
    }
    this.condicionales()
  }

  submitFormulario() {
    if (this.myForm.invalid || !this.val) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    // this.enviarCambioClave()
  }

  enviarCambioClave(contrasena: string) {

    this.loginAuth.updatePassword(contrasena).subscribe({
      next: (mensajeOk) => {
        this.logout()

      },
      error: (response: any) => {

      }
    })
  }

  condicionales() {
    // console.log(this.inputPass.nativeElement)
    if (this.myForm.get('contrasena_1')!.invalid || !this.val) {
      this.renderer.addClass(this.btnEyePass.nativeElement, "clase_btn_eye");
    } else {
      this.renderer.removeClass(this.btnEyePass.nativeElement, "clase_btn_eye");
    }
    if (this.myForm.get('contrasena')!.invalid || !this.val) {
      this.renderer.addClass(this.btnEyePass_1.nativeElement, "clase_btn_eye");
    } else {
      this.renderer.removeClass(this.btnEyePass_1.nativeElement, "clase_btn_eye");
    }
  }

  cambioPass() {
    if (this.iconName === 'bootstrapEyeSlashFill') {
      this.iconName = 'bootstrapEyeFill'
      this.inputPass.nativeElement.type = 'password'
    } else {
      this.iconName = 'bootstrapEyeSlashFill'
      this.inputPass.nativeElement.type = 'text'
    }
  }

  cambioPass_2() {
    if (this.iconName2 === 'bootstrapEyeSlashFill') {
      this.iconName2 = 'bootstrapEyeFill'
      this.inputPass1.nativeElement.type = 'password'
    } else {
      this.iconName2 = 'bootstrapEyeSlashFill'
      this.inputPass1.nativeElement.type = 'text'
    }
  }
}
