import { Component, ViewChild, importProvidersFrom } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from 'src/app/models/Empleado';
import { Puesto } from 'src/app/models/Puesto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from 'src/app/models/Rol';
import * as moment from 'moment';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'puesto', 'estado', 'fechareg', 'acciones'];
  empleados!: MatTableDataSource<Empleado>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private consultarAllEmpleados() {
    this.empleadosrv.getAllEmpleados().subscribe({
      next: (data) => {
        // console.log(data);
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
    const dialogRef = this.dialog.open(AddEmpleadoDialog, {
      //   data: new Producto
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.productoNuevo = result;
    //   if (this.productoNuevo.nombre != "") {
    //     this.agregarProducto(this.productoNuevo);
    //   }
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
  opcionSlect = ""
  opcionrol = ""
  sueldo = 0
  fechamac !: Date
  fechamin !: Date
  constructor(private fb: FormBuilder, private empleadosrv: EmpleadosService) {
    this.fechamac = new Date("2030-01-31")
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
      usuario: ['', [Validators.required, Validators.maxLength(45)]],
      rol: [''],
    });
  }

  private consultarAllPuestosRoles() {
    this.empleadosrv.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        this.opcionSlect = this.puestos[0].descripcion;
        this.sueldo = this.puestos[0].sueldo
        //this.f.sueldo.value = this.sueldo
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
    //console.log("indice: " + this.f.puesto.value)
    this.f.sueldo.value = this.puestos.at(this.f.puesto.value - 1)!.sueldo
    this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.descripcion;
    this.sueldo = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.sueldo
    // console.log("opcion seleccionada: " + this.opcionSlect)
    // console.log("sueldo: " + this.sueldo)
  }

  submitFormulario() {
    // console.log(this.sueldo);
    // console.log("valor sueldo: " + this.f.sueldo.value);
    // console.log(this.myForm.controls['sueldo'].errors)
    if (this.myForm.invalid) {
      console.log("Formulario inválido")
      Object.values(this.myForm.controls).forEach(control => {
        // console.log(control.hasError('required'))
        control.markAllAsTouched();
      });
      return;
    }
  }
}