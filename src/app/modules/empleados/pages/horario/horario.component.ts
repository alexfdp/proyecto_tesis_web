import { Component } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { Employee } from 'src/app/models/Employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import Swal from 'sweetalert2';
import { TrabajoService } from '../../services/trabajo.service';
import { Trabajo } from 'src/app/models/Horario';
defineLocale('es', esLocale);
@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent {

  public myForm!: FormGroup;
  opcionSlect = 2
  horaInicio: Date = new Date();
  horaFin: Date = new Date();
  empleados!: Employee[];
  idempelado = 0
  format_date_init: any
  readonly = false;
  isMeridian = false;
  format_date_end: any
  number_hours: any
  private trabajoE!: Trabajo
  private trabajoAC!: null
  existe = false

  constructor(private empleadoSrv: EmpleadosService, private trabajoSrv: TrabajoService, private fb: FormBuilder, private bsLocaleService: BsLocaleService) {
    this.consultarUsuarios();
    this.horaInicio.setHours(8);
    this.horaInicio.setMinutes(0);
    this.bsLocaleService.use('es');//fecha en español, datepicker  
    this.myForm = this.createMyForm();
  }

  consultarUsuarios() {
    this.empleadoSrv.getOnlyEmpleados().subscribe({
      next: (data) => {
        this.empleados = data
        this.opcionSlect = this.empleados[0].idempleado;
        this.idempelado = this.empleados[0].idempleado;
        this.consultarHorarioByID()
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      emplead: [this.opcionSlect],
      fecha_1: [this.horaInicio, [Validators.required]],
      fecha_2: [this.horaFin],
      existeE: this.existe
    });
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  changed(): void {
    let time = new Date;
    time.setHours(this.horaInicio.getHours() + 9);
    time.setMinutes(0);
    this.horaFin = time;
  }

  capturar() {
    this.idempelado = this.f.emplead.value;
    this.consultarHorarioByID()
  }

  private consultarHorarioByID() {
    this.trabajoSrv.getHorarioByID(this.idempelado).subscribe({
      next: (data) => {
        this.trabajoE = data[0]
        const hora1 = new Date(`2000-01-01T${this.trabajoE.hora_entrada}`);
        const hora2 = new Date(`2000-01-01T${this.trabajoE.hora_salida}`);
        let time1 = new Date;
        let time2 = new Date;
        time1.setHours(hora1.getHours());
        time1.setMinutes(hora1.getMinutes());
        time2.setHours(hora2.getHours());
        time2.setMinutes(hora2.getMinutes());
        this.horaInicio = time1
        this.horaFin = time2
        this.existe = true;
        this.f.existeE.value = this.existe
      },
      error: (response) => {
        var msg = response["error"]["message"]
        this.existe = false;
        this.myForm.controls['existeE'].setValue(false);
        console.log("mensaje api: " + msg);
      }
    })
  }

  submitFormulario() {
    if (this.myForm.invalid) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    this.trabajoAC = this.myForm.value;
    console.log(this.trabajoAC)
    this.trabajoSrv.putHorario(this.trabajoAC).subscribe({
      next: (data) => {
        console.log(data)
        Swal.fire({
          title: 'Horario actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }
}
