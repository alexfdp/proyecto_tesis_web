import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as moment from "moment";
import { RolPagoService } from '../../services/rol-pago.service';
import { EmpleadoRol } from 'src/app/models/EmpleadoRol';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RolPagoPdfService } from '../../services/rol-pago-pdf.service';

@Component({
  selector: 'app-rol-pagos',
  templateUrl: './rol-pagos.component.html',
  styleUrls: ['./rol-pagos.component.scss']
})
export class RolPagosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'nombre_cargo', 'nombre_departamento', 'imprimir'];
  mes_data = 'noviembre';
  empleados_roles!: MatTableDataSource<EmpleadoRol>;
  empleado !: EmpleadoRol
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  mes = 0
  anio = 0

  fecha_actual = new Date()
  fecha_valida = new Date()

  constructor(private rolpagoSrv: RolPagoService, private rolEmpleadoSrv: RolPagoPdfService) {
    this.fecha_valida.setDate(28);
    if (this.fecha_actual < this.fecha_valida) {
      this.fecha_actual.setMonth(this.fecha_actual.getMonth() - 1);
      this.mes = this.fecha_actual.getMonth() + 1
      this.anio = this.fecha_actual.getFullYear()
    } else {
      this.mes = this.fecha_actual.getMonth() + 1
      this.anio = this.fecha_actual.getFullYear()
    }
    this.consultarRolesEmpleados()
  }

  consultarRolesEmpleados() {
    this.rolpagoSrv.postListRoles(this.mes, this.anio).subscribe({
      next: (data) => {
        this.empleados_roles = new MatTableDataSource(data);
        this.empleados_roles.sort = this.sort;
        this.empleados_roles.paginator = this.paginator;
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  openeditdialog() {
    this.rolpagoSrv.postRolEmpleado(this.empleado.empleado_id, this.mes, this.anio).subscribe({
      next: (data) => {
        console.log(data)
        this.rolEmpleadoSrv.generatePayrollPdf(data);
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    });
  }

}
