import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from 'src/app/models/Empleado';
import { DatePipe } from '@angular/common';
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
  imports: [SharedModule],
})
export class AddEmpleadoDialog {

}