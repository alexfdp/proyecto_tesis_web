import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolPagoRoutingModule } from './rol-pago-routing.module';
import { RolPagosComponent } from './pages/rol-pagos/rol-pagos.component';
import { HistoricoEmpleadosComponent } from './pages/historico-empleados/historico-empleados.component';


@NgModule({
  declarations: [
    RolPagosComponent,
    HistoricoEmpleadosComponent
  ],
  imports: [
    CommonModule,
    RolPagoRoutingModule
  ]
})
export class RolPagoModule { }
