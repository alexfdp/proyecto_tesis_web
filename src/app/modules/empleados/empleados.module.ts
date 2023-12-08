import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadosRoutingModule } from './empleados-routing.module';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';

@NgModule({
  declarations: [
    TrabajoComponent,
    PerfilesComponent,
    TurnosComponent,
    EmpleadosComponent
  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    
  ],
})
export class EmpleadosModule { }
