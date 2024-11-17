import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/page/home/home.component';
import { MenuComponent } from './modules/menu/menu.component';
import { UsersComponent } from './modules/users/users/users.component';
import { EmpresaComponent } from './modules/empresa/pages/empresa/empresa.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: "", pathMatch: 'full', redirectTo: '/login'
  },
  {
    path: '',
    children: [
      {
        path: '', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: '', component: MenuComponent, canActivate: [authGuard],
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
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
