import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './modules/login/pages/forgot-password/forgot-password.component';
import { HomeComponent } from './modules/home/page/home/home.component';
import { LoginComponent } from './modules/login/pages/login/login.component';
import { MenuComponent } from './modules/menu/menu.component';
import { UsersComponent } from './modules/users/users/users.component';
import { EmpresaComponent } from './modules/empresa/empresa/empresa.component';

const routes: Routes = [
  {
    path: "", pathMatch: 'full', redirectTo: '/login'
  },
  {
    path: '',
    children: [
      {
        path: 'login', component: LoginComponent, loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'password_reset', component: ForgotPasswordComponent, loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: '', component: MenuComponent,
    children: [
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'empresa', component: EmpresaComponent,
      },
      {
        path: '', loadChildren: () => import('./modules/empleados/empleados.module').then(m => m.EmpleadosModule)
      },
      {
        path: '', loadChildren: () => import('./modules/rol-pago/rol-pago.module').then(m => m.RolPagoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
