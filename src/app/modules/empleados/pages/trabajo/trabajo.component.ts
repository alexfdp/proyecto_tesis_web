import { Component } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { Employee } from 'src/app/models/Employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-trabajo',
  templateUrl: './trabajo.component.html',
  styleUrls: ['./trabajo.component.scss']
})
export class TrabajoComponent {

  public myForm!: FormGroup;
  mytime: Date = new Date();
  empleados!: Employee[];
  fecha_ini!: Date;
  fecha_end!: Date
  fecha_inicio: any
  fecha_fin: any
  fechas_val = false

  constructor(private empleadoSrv: EmpleadosService,
    private fb: FormBuilder,
    private miDatePipe: DatePipe,) {
    this.consultarUsuarios();
    this.myForm = this.createMyForm();
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
    this.fecha_ini = new Date()
    this.fecha_end = new Date()
    return this.fb.group({
      // fecha_1: [this.fecha_ini,],
      // hora_1: [this.fecha_ini,],
      // fecha_2: [this.fecha_end,],
      // hora_2: [this.fecha_end,],
    });
  }

  submitFormulario() {
    // console.log(this.myForm.get('fecha_1')!.value > this.myForm.get('fecha_2')!.value)
    // console.log(this.myForm.get('fecha_1')!.value < this.myForm.get('fecha_2')!.value)
    this.fechas_val = this.myForm.get('fecha_1')!.value > this.myForm.get('fecha_2')!.value
    console.log(this.fechas_val)
    if (this.myForm.invalid || this.fechas_val) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.fecha_inicio = this.miDatePipe.transform((this.myForm.get('fecha_1')!.value), 'yyyy-MM-dd');
    this.fecha_inicio += " " + this.miDatePipe.transform(this.myForm.get('hora_1')!.value, 'HH:mm:ss');
    this.fecha_fin = this.miDatePipe.transform((this.myForm.get('fecha_2')!.value), 'yyyy-MM-dd');
    this.fecha_fin += " " + this.miDatePipe.transform(this.myForm.get('hora_2')!.value, 'HH:mm:ss');
    console.log("fecha de inicio: " + this.fecha_inicio + "\nFecha de fin: " + this.fecha_fin)
  }
}
