import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';

const routes: Routes = [
  {
    path: 'empleados', component: EmpleadosComponent
  },
  {
    path: 'perfiles', component: PerfilesComponent
  },
  {
    path: 'trabajo', component: TrabajoComponent
  },
  {
    path: 'turnos', component: TurnosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
