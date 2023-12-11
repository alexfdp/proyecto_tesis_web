import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service';
import { Auth } from 'src/app/models/Auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public myForm!: FormGroup;
  private loginDto!: Auth;

  constructor(private fb: FormBuilder, private routerprd: Router,
    private loginAuth: LoginServiceService,) {
  }

  redirecMenu() {
    this.routerprd.navigateByUrl("/home");
  }

  login(login: Auth) {
    this.loginAuth.autenticar(login).subscribe({
      next: (authTokenD) => {
        sessionStorage.setItem('token', authTokenD.token);
        localStorage.setItem('token', authTokenD.token);
        this.redirecMenu();
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        Swal.fire({
          title: 'Error al autenticar',
          text: 'Error: ' + msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.log("mensaje api: " + msg);
      }
    });
  }

  public submitFormulario() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.loginDto = this.myForm.value;
    this.login(this.loginDto);
  }

  ngOnInit(): void {
    this.sesion();
    this.loginAuth.cargar(['validaciones']);
    this.myForm = this.createMyForm();
  }

  sesion() {
    if (localStorage.getItem("token")) {
      this.routerprd.navigateByUrl("/home")
    }
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  public ForgotPass() {
    this.routerprd.navigateByUrl("/password_reset")
  }

  public get f(): any {
    return this, this.myForm.controls;
  }
}