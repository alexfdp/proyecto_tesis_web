import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service';
import { Auth } from 'src/app/models/Auth';
import Swal from 'sweetalert2';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public myForm!: FormGroup;
  private loginDto!: Auth;
  charge = false

  constructor(private fb: FormBuilder, private routerprd: Router,
    private loginAuth: LoginServiceService,) {
  }

  redirecMenu() {
    this.routerprd.navigateByUrl("/home");
  }

  redirecChangePass() {
    this.routerprd.navigateByUrl("/change_password");
  }

  login(login: Auth) {
    this.loginAuth.autenticar(login).subscribe({
      next: (authTokenD) => {
        localStorage.setItem('estate', "" + authTokenD.estado);
        localStorage.setItem('token', authTokenD.token);
        if (authTokenD.estado === 1) {
          this.redirecMenu();
        } else {
          this.redirecChangePass()
        }
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
    this.charge = true
    this.login(this.loginDto);
  }

  ngOnInit(): void {
    this.sesion();
    this.loginAuth.cargar(['validaciones']);
    this.myForm = this.createMyForm();
  }

  sesion() {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("estate") === "1") {
        this.redirecMenu();
      } else {
        if (localStorage.getItem("estate") === "2") {
          this.redirecChangePass()
        }
      }
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