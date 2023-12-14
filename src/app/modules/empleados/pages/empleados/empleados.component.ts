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
import { Rol } from 'src/app/models/Rol';
import * as moment from 'moment';
import { EmpleadoDAO } from 'src/app/models/EmpleadoDAO';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
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
    const dialogRef = this.dialog.open(AddEmpleadoDialog, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed: ' + result);
      this.consultarAllEmpleados();
    });
  }

  openeditdialog(): void {
    const dialogRef = this.dialog.open(EditEmpleadoDialog, {
      data: this.empleadoSelect
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.consultarAllEmpleados();
    // });
  }
}


/* Dialog para agregar nuevo empleado */
@Component({
  selector: 'add-empleado-dialog',
  templateUrl: 'add-empleado-dialog.html',
  styleUrls: ['./empleados.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, BsDatepickerModule],
})
export class AddEmpleadoDialog {
  public myForm!: FormGroup;
  public puestos!: Puesto[]
  public roles!: Rol[]
  private empleado!: EmpleadoDAO
  opcionSlect = ""
  opcionrol = ""
  sueldo = 0
  fechamac !: Date
  fechamin !: Date

  constructor(public dialogRef: MatDialogRef<AddEmpleadoDialog>, private fb: FormBuilder,
    private empleadosrv: EmpleadosService, private miDatePipe: DatePipe) {
    this.fechamac = moment().subtract(59, 'year').toDate();
    this.fechamin = moment().subtract(18, 'year').toDate();
    this.myForm = this.createMyForm();
    this.consultarAllPuestosRoles();
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
      sueldo: ['', [Validators.required, Validators.min(0)]],
      puesto: [''],
      fecha_nacimient: ['', [Validators.required]],
      fecha_ingres: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(45)]],
      rol: [''],
    });
  }

  onValueChanges(event: KeyboardEvent): void {
    const keyCode = event.key.charCodeAt(0)
    if (keyCode < 47 || keyCode > 57) {
      event.preventDefault();
    }
  }

  private consultarAllPuestosRoles() {
    this.empleadosrv.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        this.opcionSlect = this.puestos[0].descripcion;
        this.sueldo = this.puestos[0].sueldo
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })

    this.empleadosrv.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.opcionrol = this.roles[0].descripcion;
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  capturar() {
    this.f.sueldo.value = this.puestos.at(this.f.puesto.value - 1)!.sueldo
    this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.descripcion;
    this.sueldo = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.sueldo
  }

  submitFormulario() {
    // console.log(this.myForm.controls['fecha_nacimiento'].errors)
    if (this.myForm.invalid) {
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
    this.empleado.rol_id = this.roles.find(rol => rol.descripcion === this.f.rol.value)!.idrol
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
  imports: [CommonModule, MatDialogModule, MatInputModule, FormsModule, ReactiveFormsModule],
})
export class EditEmpleadoDialog {
  public myForm!: FormGroup;
  deshabilitado = true
  nombres!: string

  constructor(
    public dialogRef: MatDialogRef<EditEmpleadoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Empleado,
    private fb: FormBuilder
  ) {
    this.myForm = this.createMyForm();
    this.datos()
  }

  datos() {
    this.nombres = this.data.nombre + " " + this.data.apellido + " " + this.data.apellido_2
  }

  public get f(): any {
    return this, this.myForm.controls;
  }

  private createMyForm(): FormGroup {
    return this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      correo: ['', [Validators.required, Validators.maxLength(200), Validators.email]],
      sueldo: ['', [Validators.required, Validators.min(0)]],
      puesto: [''],
      fecha_nacimient: ['', [Validators.required]],
      fecha_ingres: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(45)]],
      rol: [''],
    });
  }

  submitFormulario() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}