import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolPagoRoutingModule } from './rol-pago-routing.module';
import { RolPagosComponent } from './pages/rol-pagos/rol-pagos.component';
import { HistoricoEmpleadosComponent } from './pages/historico-empleados/historico-empleados.component';
import { bootstrapFileEarmarkPdfFill } from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    RolPagosComponent,
    HistoricoEmpleadosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbDatepicker,
    FormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatSlideToggleModule,
    RolPagoRoutingModule,
    NgIconsModule.withIcons({ bootstrapFileEarmarkPdfFill }),
  ]
})
export class RolPagoModule { }
