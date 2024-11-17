import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorarioComponent } from './pages/horario/horario.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';

const routes: Routes = [
  {
    path: 'empleados', component: EmpleadosComponent
  },
  {
    path: 'horario', component: HorarioComponent
  },
  {
    path: 'trabajo', component: TrabajoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
