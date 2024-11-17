import { Component, ViewChild } from "@angular/core";
import * as moment from "moment";
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TrabajoService } from "../../services/trabajo.service";
import { HorasTrabajo } from "src/app/models/HorasTrabajo";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2';
import { EditTrabajoDialog } from "./edit-trabajo/edit-trabajo.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-trabajo',
    templateUrl: './trabajo.component.html',
    styleUrls: ['./trabajo.component.scss']
})
export class TrabajoComponent {

    displayedColumns: string[] = ['id', 'nombre', 'fecha', 'horasT', 'horasE', 'total', 'comentario', 'acciones'];
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    fechaTrabajo = moment().subtract(1, 'day').toDate();
    fechaMax = new Date();
    horasTrabajo !: MatTableDataSource<HorasTrabajo>
    trabajoEmpleado!: HorasTrabajo

    constructor(private bsLocaleService: BsLocaleService, private trabajoSrv: TrabajoService, private datepipe: DatePipe,
        public dialog: MatDialog) {
        this.bsLocaleService.use('es');
        this.fechaTrabajo = moment().subtract(1, 'day').toDate();
        let valor: number
        valor = this.esFinDeSemana(this.fechaTrabajo)
        if (valor === 6) {
            this.fechaTrabajo = moment().subtract(2, 'day').toDate();
        } else if (valor === 0) {
            this.fechaTrabajo = moment().subtract(3, 'day').toDate();
        }
        this.consultarHoras()
    }

    private consultarHoras() {
        // console.log(this.fechaTrabajo)
        let fecha = this.formatofechaConsulta(this.fechaTrabajo)
        this.trabajoSrv.postHorasTrabajadas(fecha).subscribe({
            next: (data) => {
                this.horasTrabajo = new MatTableDataSource(data)
                this.horasTrabajo.sort = this.sort;
                this.horasTrabajo.paginator = this.paginator;
            },
            error: (response) => {
                this.generarData();
                var msg = response["error"]["message"]
                console.log("mensaje api: " + msg);
            }
        })
    }

    private generarData() {
        let fecha = this.formatofechaConsulta(this.fechaTrabajo)
        Swal.fire({
            title: "No hay datos para la fecha \n" + fecha,
            text: "¿Desea generar registros de manera automática?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar"
        }).then((result) => {
            if (result.isConfirmed) {
                this.continuarRegistro(fecha)
            }
        });
    }

    private continuarRegistro(fecha: any) {
        console.log(fecha)
        this.trabajoSrv.putGenerarRegistros(fecha).subscribe({
            next: (data) => {
                Swal.fire({
                    title: "Generado",
                    text: "Data generada correctamente",
                    icon: "success"
                });
                this.consultarHoras()
            },
            error: (response) => {
                this.generarData();
                Swal.fire({
                    title: "Error al generar data",
                    icon: "error"
                });
                var msg = response["error"]["message"]
                console.log("mensaje api: " + msg);
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.horasTrabajo.filter = filterValue.trim().toLowerCase();

        if (this.horasTrabajo.paginator) {
            this.horasTrabajo.paginator.firstPage();
        }
    }

    formatofecha(fecha: Date) {
        return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
    }

    formatofechaConsulta(fecha: Date) {
        return this.datepipe.transform(fecha, 'yyyy-MM-dd');
    }

    protected filtrar(): void {
        this.consultarHoras()
    }

    openeditdialog(): void {
        const dialogRef = this.dialog.open(EditTrabajoDialog, {
            data: this.trabajoEmpleado
        });
    }

    esFinDeSemana(fecha: Date) {
        const diaSemana = fecha.getDay();
        return diaSemana;
    }
}
