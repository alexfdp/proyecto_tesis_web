import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CambiarClaveComponent } from './pages/cambiar-clave/cambiar-clave.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'password_reset', component: ForgotPasswordComponent },
  { path: 'change_password', component: CambiarClaveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
