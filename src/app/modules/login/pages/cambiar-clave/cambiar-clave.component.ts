import { Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgIconLoader } from '@ng-icons/core';


@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss']
})
export class CambiarClaveComponent {

  @ViewChild('inputPass1') inputPass1!: ElementRef;
  @ViewChild('inputPass') inputPass!: ElementRef;
  public myForm!: FormGroup;
  val = true;
  iconName = 'bootstrapEyeFill';
  iconName2 = 'bootstrapEyeFill';

  constructor(private routerprd: Router, private fb: FormBuilder,
  ) {
    this.myForm = this.createMyForm();
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
      contrasena_1: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  cambioPassEvent(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const contrasena = this.myForm.get('contrasena_1')?.value
    if (filterValue === contrasena) {
      this.val = true
    } else {
      this.val = false
    }
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

  enviarCambioClave() {

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
