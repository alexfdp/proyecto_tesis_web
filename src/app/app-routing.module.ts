import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/public/login/login.component';
import { ForgotPasswordComponent } from './modules/login/pages/forgot-password/forgot-password.component';
import { HomeComponent } from './modules/home/page/home/home.component';

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
    path: '',
    children: [
      {
        path: 'home', component: HomeComponent, loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
