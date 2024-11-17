import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadosRoutingModule } from './empleados-routing.module';
import { HorarioComponent } from './pages/horario/horario.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgIconsModule, provideNgIconsConfig } from '@ng-icons/core';
import { bootstrapInfoCircleFill, bootstrapToggle2Off, bootstrapToggle2On, bootstrapToggleOff, bootstrapToggleOn } from '@ng-icons/bootstrap-icons';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Ítems por página:';
  override nextPageLabel = 'Siguiente página';
  override previousPageLabel = 'Página anterior';
}

@NgModule({
  declarations: [
    HorarioComponent,
    EmpleadosComponent,
    TrabajoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmpleadosRoutingModule,
    SharedModule,
    NgbDatepicker,
    FormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatSlideToggleModule,
    NgIconsModule.withIcons({ bootstrapInfoCircleFill, bootstrapToggle2On, bootstrapToggle2Off, bootstrapToggleOff, bootstrapToggleOn }),
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    // provideNgIconsConfig({
    //   size: '20px',
    // }),
  ]
})
export class EmpleadosModule { }
