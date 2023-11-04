import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { RegistroComponent } from './pages/registro/registro.component';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { TurnosComponent } from './pages/turnos/turnos.component';


@NgModule({
  declarations: [
    RegistroComponent,
    TrabajoComponent,
    PerfilesComponent,
    TurnosComponent
  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule
  ]
})
export class EmpleadosModule { }
