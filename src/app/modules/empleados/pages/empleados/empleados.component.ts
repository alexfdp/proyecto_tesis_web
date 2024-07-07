import { Component, Inject, ViewChild } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import generator from 'generate-password-ts';
import { MatTableDataSource } from '@angular/material/table';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from 'src/app/models/Empleado';
import { Puesto } from 'src/app/models/Puesto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EmpleadoDAO } from 'src/app/models/EmpleadoDAO';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'puesto', 'estado', 'fechareg', 'acciones'];
  empleados!: MatTableDataSource<Empleado>;
  empleadoSelect!: Empleado
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public puestos!: Puesto[]

  private consultarAllPuestosRoles() {
    this.empleadosrv.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
      },
      error: (response) => {
        var msg = response['error']['message'];
        console.log('mensaje api: ' + msg);
      }
    });
  }

  private consultarAllEmpleados() {
    this.empleadosrv.getAllEmpleados().subscribe({
      next: (data) => {
        this.empleados = new MatTableDataSource(data);
        this.empleados.sort = this.sort;
        this.empleados.paginator = this.paginator;
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  constructor(public dialog: MatDialog, private datepipe: DatePipe, private empleadosrv: EmpleadosService) {
    this.consultarAllEmpleados();
    this.consultarAllPuestosRoles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.empleados.filter = filterValue.trim().toLowerCase();

    if (this.empleados.paginator) {
      this.empleados.paginator.firstPage();
    }
  }

  formatofecha(fecha: Date) {
    return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEmpleadoDialog, {
      data: { puestos: this.puestos }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.consultarAllEmpleados();
    });
  }

  openeditdialog(): void {
    const dialogRef = this.dialog.open(EditEmpleadoDialog, {
      data: { empleado: this.empleadoSelect, puestos: this.puestos }
    });
  }

  updateEstado() {
    this.empleadosrv.putEstado(this.empleadoSelect).subscribe({
      next: (mensaje) => {
        console.log("Ok de API: " + mensaje.message)
        Swal.fire({
          title: 'Estado actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.consultarAllEmpleados();
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        Swal.fire({
          title: 'Error al actualizar estado',
          text: 'Error: ' + msg.toUpperCase(),
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.log("mensaje error api: " + msg);
      }
    })
  }
}


/* Dialog para agregar nuevo empleado */
@Component({
  selector: 'add-empleado-dialog',
  templateUrl: 'add-empleado-dialog.html',
  styleUrls: ['./empleados.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule,
    BsDatepickerModule, MatDividerModule],
})
export class AddEmpleadoDialog {
  public myForm!: FormGroup;
  public puestos!: Puesto[]
  validauser = true;
  private empleado!: EmpleadoDAO
  opcionSlect = ""
  sueldo = 0
  fechamac !: Date
  fechamin !: Date

  constructor(public dialogRef: MatDialogRef<AddEmpleadoDialog>, private fb: FormBuilder,
    private empleadosrv: EmpleadosService, private miDatePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.puestos = data.puestos;
    this.sueldo = this.puestos[0].sueldo
    this.opcionSlect = this.puestos[0].descripcion;
    this.fechamac = moment().subtract(59, 'year').toDate();
    this.fechamin = moment().subtract(18, 'year').toDate();
    this.myForm = this.createMyForm();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.empleadosrv.getUsuario(filterValue).subscribe({
      next: (data) => {
        this.validauser = true
      },
      error: (response) => {
        this.validauser = false
        var msg = response["error"]["message"]
        console.log("Error de la API: " + msg);
      }
    })
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑá-úÁ-Ú ]*')]],
      apellido: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑá-úÁ-Ú ]*')]],
      apellido_2: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑá-úÁ-Ú ]*')]],
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      correo: ['', [Validators.required, Validators.maxLength(200), Validators.email]],
      sueldo: [this.sueldo, [Validators.required, Validators.min(0)]],
      puesto: [this.opcionSlect],
      fecha_nacimient: ['', [Validators.required]],
      fecha_ingres: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑ0-9_]*')]],
    });
  }

  onValueChanges(event: KeyboardEvent): void {
    const keyCode = event.key.charCodeAt(0)
    if (keyCode < 47 || keyCode > 57) {
      event.preventDefault();
    }
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  capturar() {
    this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.descripcion;
    this.sueldo = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.sueldo;
    this.f.sueldo.value = this.sueldo;
    this.myForm.controls['sueldo'].setValue(this.sueldo);
    // this.myForm.controls['sueldo'].add;
  }

  submitFormulario() {
    if (this.myForm.invalid || !this.validauser) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }

    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      symbols: true
    });
    this.empleado = this.myForm.value
    this.empleado.fecha_contratacion = this.miDatePipe.transform(this.empleado.fecha_ingres, 'yyyy-MM-dd HH:mm:ss');
    this.empleado.fecha_nacimiento = this.miDatePipe.transform(this.empleado.fecha_nacimient, 'yyyy-MM-dd HH:mm:ss');
    this.empleado.puesto_id = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.idpuesto;
    this.empleado.rol_id =this.empleado.puesto_id
    this.empleado.contrasena = password
    this.registro(this.empleado)
  }

  registro(employee: EmpleadoDAO) {
    this.empleadosrv.postEmpleado(employee).subscribe({
      next: (mensaje) => {
        console.log("Ok de API: " + mensaje.message)
        Swal.fire({
          title: 'Datos guardados correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.dialogRef.close();
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        Swal.fire({
          title: 'Error al guardar',
          text: 'Error: ' + msg.toUpperCase(),
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.log("mensaje error api: " + msg);
        this.dialogRef.close();
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

/* Dialog para agregar nuevo empleado */
@Component({
  selector: 'edit-empleado-dialog',
  templateUrl: 'edit-empleado-dialog.html',
  styleUrls: ['./empleados.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatDialogModule, ReactiveFormsModule,
    BsDatepickerModule, MatInputModule, FormsModule, CommonModule, MatDividerModule
  ],
})
export class EditEmpleadoDialog {
  public myForm!: FormGroup;
  empleado!: Empleado
  public puestos!: Puesto[]
  opcionSlect = ""
  puesto_id = 0
  sueldo = 0

  constructor(
    public dialogRef: MatDialogRef<EditEmpleadoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private empleadosrv: EmpleadosService
  ) {
    this.empleado = data.empleado;
    this.puestos = data.puestos;
    this.sueldo = this.empleado.sueldo
    this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.empleado.puesto)?.descripcion || '';
    this.puesto_id = this.puestos.find(puesto => puesto.descripcion === this.empleado.puesto)?.idpuesto || 0;
    this.myForm = this.createMyForm();
    this.myForm.controls['nombre'].disable();
    this.myForm.controls['cedula'].disable();
    this.myForm.controls['fecha_nacimiento'].disable();
    this.myForm.controls['fecha_ingreso'].disable();
    this.myForm.controls['usuario'].disable();
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      nombre: [this.empleado.nombre + ' ' + this.empleado.apellido + ' ' + this.empleado.apellido_2],
      fecha_nacimiento: [this.formatofecha(this.empleado.fecha_nacimiento)],
      cedula: [this.empleado.cedula],
      direccion: [this.empleado.direccion, [Validators.required, Validators.maxLength(200)]],
      telefono: [this.empleado.telefono, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      correo: [this.empleado.correo, [Validators.required, Validators.maxLength(200), Validators.email]],
      sueldo: [this.sueldo, [Validators.required, Validators.min(0)]],
      puesto: [this.opcionSlect],
      puesto_id: [this.puesto_id],
      fecha_ingreso: [this.formatofecha(this.empleado.fecha_contratacion)],
      usuario: [this.empleado.usuario],
    });
  }

  submitFormulario() {
    if (this.myForm.invalid) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
      return;
    }
    const idempleado = this.empleado.idempleado;
    this.empleado = this.myForm.value;
    this.empleado.puesto_id = this.puesto_id;
    this.empleado.idempleado = idempleado
    this.updateEmployee(this.empleado);
  }

  updateEmployee(empleado: Empleado) {
    this.empleadosrv.putEmpleado(empleado).subscribe({
      next: (mensaje) => {
        console.log("Ok de API: " + mensaje.message)
        Swal.fire({
          title: 'Datos actualizados correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.dialogRef.close();
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        Swal.fire({
          title: 'Error al actualizar',
          text: 'Error: ' + msg.toUpperCase(),
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.log("mensaje error api: " + msg);
        this.dialogRef.close();
      }
    })
  }

  capturar() {
    this.sueldo = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.sueldo;
    this.puesto_id = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.idpuesto;
    this.f.sueldo.value = this.sueldo;
    this.myForm.controls['sueldo'].setValue(this.sueldo);
    this.f.puesto_id.value = this.puesto_id
  }

  formatofecha(fecha: Date) {
    return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}