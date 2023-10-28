import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/public/login/login.component';

const routes: Routes = [
  {
    path: "public", component: LoginComponent, loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: "", pathMatch: 'full', redirectTo: 'public/login'
  },
  // {
  //   path: 'sinsesion', component: SesionComponent, loadChildren: () => import('./modules/login/login.module').then(m => m.loginModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
