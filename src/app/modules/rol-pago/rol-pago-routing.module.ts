import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolPagosComponent } from './pages/rol-pagos/rol-pagos.component';
import { HistoricoEmpleadosComponent } from './pages/historico-empleados/historico-empleados.component';

const routes: Routes = [
  {
    path: 'roles-pagos', component: RolPagosComponent
  },
  {
    path: 'historico', component: HistoricoEmpleadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolPagoRoutingModule { }
