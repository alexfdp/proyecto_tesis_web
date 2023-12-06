import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from 'src/app/models/Empleado';
import { Puesto } from 'src/app/models/Puesto';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    return this.datepipe.transform(fecha, 'dd/MMM/yyyy HH:mm');
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
  imports: [SharedModule, CommonModule, NgIf, NgFor, FormsModule, ReactiveFormsModule],
})
export class AddEmpleadoDialog {
  public myForm!: FormGroup;
  public puestos !: Puesto[]

  constructor(private fb: FormBuilder, private empleadosrv: EmpleadosService) {
    this.myForm = this.createMyForm();
    this.consultarAllPuestos();
  }

  public get f(): any {
    return this, this.myForm.controls;
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
      sueldo: [, [Validators.required, Validators.min(1)]],
      puesto: [''],
      usuario: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  private consultarAllPuestos() {
    this.empleadosrv.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        console.log(this.puestos[0])
        this.sueldo = this.puestos[0].sueldo
        this.f.sueldo.value = this.sueldo
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }
  sueldo!:number
  capturar() {
    //this.f.sueldo = this.puestos.at(this.f.puesto.value - 1)!.sueldo
    this.sueldo = this.puestos.at(this.f.puesto.value - 1)!.sueldo
  }

  submitFormulario() {
    console.log("valor sueldo: " + this.f.sueldo.value);
    if (this.myForm.invalid) {
      console.log("error: " + this.f.sueldo.value)
      Object.values(this.myForm.controls).forEach(control => {
        control.getError
        control.markAllAsTouched();
      });
      return;
    }
  }


}