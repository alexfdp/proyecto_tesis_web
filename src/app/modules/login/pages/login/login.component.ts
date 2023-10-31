import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public myForm!: FormGroup;

  constructor(private fb: FormBuilder, private routerprd: Router,private loginAuth: LoginServiceService) {
  }

  ngOnInit(): void {
    this.loginAuth.cargar(['validaciones']);
    this.myForm = this.createMyForm();
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  public get f(): any {
    return this, this.myForm.controls;
  }
}