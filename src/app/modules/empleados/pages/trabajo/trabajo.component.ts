import { Component } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { Employee } from 'src/app/models/Employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';

defineLocale('es', esLocale);
@Component({
  selector: 'app-trabajo',
  templateUrl: './trabajo.component.html',
  styleUrls: ['./trabajo.component.scss']
})
export class TrabajoComponent {

  public myForm!: FormGroup;
  minDateInicio: Date = new Date();
  minDateFin: Date = new Date();
  empleados!: Employee[];
  fecha_inicio!: Date
  fecha_fin!: Date
  fechas_val = true
  format_date_init: any
  format_date_end: any
  number_hours: any

  constructor(private empleadoSrv: EmpleadosService,
    private fb: FormBuilder,
    private miDatePipe: DatePipe, private bsLocaleService: BsLocaleService) {
    this.consultarUsuarios();
    this.bsLocaleService.use('es');//fecha en español, datepicker
    this.myForm = this.createMyForm();
    this.minDateInicio.setDate(this.minDateInicio.getDate() - 1);
    this.minDateFin.setHours(this.minDateFin.getHours() + 8);
  }

  consultarUsuarios() {
    this.empleadoSrv.getOnlyEmpleados().subscribe({
      next: (data) => {
        this.empleados = data
        // console.log(this.empleados)
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      fecha_1: [new Date(),],
      fecha_2: [this.minDateFin,]
    });
  }

  submitFormulario() {
    this.fecha_inicio = this.myForm.get('fecha_1')?.value
    this.fecha_fin = this.myForm.get('fecha_2')?.value
    this.fechas_val = this.fecha_inicio >= this.fecha_fin
    if (this.myForm.invalid || this.fechas_val) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.format_date_init = this.miDatePipe.transform(this.fecha_inicio, 'yyyy-MM-dd HH:mm:ss');
    this.format_date_end = this.miDatePipe.transform(this.fecha_fin, 'yyyy-MM-dd HH:mm:ss');
    this.number_hours = Math.round((this.fecha_fin.getTime() - this.fecha_inicio.getTime()) / (1000 * 60 * 60))
    // console.log('fecha de inicio: ' + this.format_date_init)
    // console.log('fecha de inicio: ' + this.format_date_end)
    // console.log('número de horas: ' + this.number_hours)
    
  }
}
