import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadosRoutingModule } from './empleados-routing.module';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgIconsModule, provideNgIconsConfig } from '@ng-icons/core';
import { bootstrapInfoCircleFill } from '@ng-icons/bootstrap-icons'
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
    NgIconsModule.withIcons({bootstrapInfoCircleFill }),
  ],
  providers:[
    provideNgIconsConfig({
      size: '20px',
    }),
  ]
})
export class EmpleadosModule { }
