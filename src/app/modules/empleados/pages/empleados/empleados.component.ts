import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from 'src/app/models/Empleado';
import { Puesto } from 'src/app/models/Puesto';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import generator from 'generate-password-ts';
import { AddEmpleadoDialog } from './add-empleado/add-empleado.component';
import { EditEmpleadoDialog } from './edit-empleado/edit-empleado.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
})
export class EmpleadosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'cargo', 'departamento', 'estado', 'estadoU', 'fechareg', 'acciones'];
  empleados!: MatTableDataSource<Empleado>;
  empleadoSelect!: Empleado
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public puestos!: Puesto[]

  private consultarAllPuestosRoles() {
    this.empleadosrv.getCargos().subscribe({
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
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      symbols: '_.-'
    });
    this.empleadoSelect.contrasena = password
    let texto = ""
    if (this.empleadoSelect.estado === 0) {
      texto = "<b>Usuario</b>: " + this.empleadoSelect.usuario + "<br><b>Contraseña</b>: " + this.empleadoSelect.contrasena
    }
    this.empleadosrv.putEstado(this.empleadoSelect).subscribe({
      next: (mensaje) => {
        //console.log("Ok de API: " + mensaje.message)
        Swal.fire({
          title: 'Estado actualizado correctamente',
          icon: 'success',
          html: texto,
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