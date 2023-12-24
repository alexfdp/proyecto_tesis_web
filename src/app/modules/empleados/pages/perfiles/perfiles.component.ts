import { Component, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { EmpleadosService } from '../../services/empleados.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { EditPerfilDialog } from './edit-perfil/edit-perfil-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Rol } from 'src/app/models/Rol';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent {
  usuarios!: MatTableDataSource<Usuario>
  roles!: Rol[]
  usuarioSelect!: Usuario
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'nombre', 'usuario', 'estado', 'rol', 'fechareg', 'acciones'];

  constructor(private empleadoSrv: EmpleadosService,
    public dialog: MatDialog,
    private datepipe: DatePipe) {
    this.consultarUsuarios()
    this.consultarRoles()
  }

  consultarUsuarios() {
    this.empleadoSrv.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuarios = new MatTableDataSource(data);
        this.usuarios.sort = this.sort;
        this.usuarios.paginator = this.paginator;
        // console.log(data);
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
      }
    })
  }

  consultarRoles() {
    this.empleadoSrv.getRoles().subscribe({
      next: (data) => {
        this.roles = data
      },
      error: (response) => {
        var msg = response["error"]["message"]
        console.log("mensaje error api: " + msg);
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditPerfilDialog, {
      data: { usuario: this.usuarioSelect, roles: this.roles }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.consultarUsuarios();
    });
  }

  formatofecha(fecha: Date) {
    return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.empleados.filter = filterValue.trim().toLowerCase();

    // if (this.empleados.paginator) {
    //   this.empleados.paginator.firstPage();
    // }
  }
}
