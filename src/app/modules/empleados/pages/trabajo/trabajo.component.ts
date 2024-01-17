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
  mytime: Date = new Date();
  empleados!: Employee[];
  fecha_rango: Date[] = [new Date(), new Date()]
  fecha_inicio: any
  fecha_fin: any
  fechas_val = false
  minDate: Date;

  constructor(private empleadoSrv: EmpleadosService,
    private fb: FormBuilder,
    private miDatePipe: DatePipe, private bsLocaleService: BsLocaleService) {
    this.consultarUsuarios();
    this.bsLocaleService.use('es');//fecha en español, datepicker
    this.myForm = this.createMyForm();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
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
      fecha_1: [this.fecha_rango,],
    });
  }

  submitFormulario() {
    this.fecha_rango = this.myForm.get('fecha_1')?.value
    if (this.fecha_rango[0] > this.fecha_rango[1]) {
      this.fechas_val = true
    } else {
      this.fechas_val = false
    }
    if (this.myForm.invalid || this.fechas_val) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.fecha_inicio = this.miDatePipe.transform((this.fecha_rango[0]), 'yyyy-MM-dd HH:mm:ss');
    console.log(this.fecha_inicio)
    // this.fecha_inicio += " " + this.miDatePipe.transform(this.myForm.get('hora_1')!.value, 'HH:mm:ss');
    // this.fecha_fin = this.miDatePipe.transform((this.myForm.get('fecha_2')!.value), 'yyyy-MM-dd');
    // this.fecha_fin += " " + this.miDatePipe.transform(this.myForm.get('hora_2')!.value, 'HH:mm:ss');
    // console.log("fecha de inicio: " + this.fecha_inicio + "\nFecha de fin: " + this.fecha_fin)
  }
}
