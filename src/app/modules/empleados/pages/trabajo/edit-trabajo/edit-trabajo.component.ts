import { CommonModule, DatePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { Empleado } from "src/app/models/Empleado";
import { Puesto } from "src/app/models/Puesto";
import Swal from "sweetalert2";
import { EmpleadosService } from "../../../services/empleados.service";
import { HorasTrabajo } from "src/app/models/HorasTrabajo";
import { TrabajoService } from "../../../services/trabajo.service";

/* Dialog para agregar nuevo empleado */
@Component({
    selector: 'edit-empleado-dialog',
    templateUrl: 'edit-trabajo-dialog.html',
    styleUrls: ['../trabajo.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatDialogModule, ReactiveFormsModule,
        BsDatepickerModule, MatInputModule, FormsModule, CommonModule, MatDividerModule
    ],
})
export class EditTrabajoDialog {
    public myForm!: FormGroup;
    horasEmpleado!: any

    constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<EditTrabajoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: HorasTrabajo, private datepipe: DatePipe, private trabajoSrv: TrabajoService) {
        this.horasEmpleado = data;
        this.myForm = this.createMyForm();
    }

    private createMyForm(): FormGroup {
        return this.fb.group({
            empleado_id: [this.horasEmpleado.empleado_id],
            nombre: [this.horasEmpleado.nombre],
            fecha_trabajo: [this.formatofecha(this.horasEmpleado.fecha_trabajo)],
            horas_regulares_trabajadas: [this.horasEmpleado.horas_regulares_trabajadas,
            [Validators.required, Validators.max(8), Validators.min(0), Validators.pattern('[0-9]*')]],
            horas_extras: [this.horasEmpleado.horas_extras, [Validators.required, Validators.min(0),
            Validators.max(16), Validators.pattern('[0-9]*')]],
            comentario: [this.horasEmpleado.comentario, [Validators.maxLength(200)]],
        });
    }

    protected submitFormulario() {
        if (this.myForm.invalid) {
            console.log("Formulario inválido")
            Object.values(this.myForm.controls).forEach(control => {
                control.markAllAsTouched();
            });
            return;
        }
        let fecha = this.formatofechaConsulta(this.horasEmpleado.fecha_trabajo);
        let fecha_1 = this.horasEmpleado.fecha_trabajo;
        this.horasEmpleado = this.myForm.value;
        this.horasEmpleado.fecha = fecha
        this.horasEmpleado.fecha_trabajo = fecha_1
        this.actualizarHoras(this.horasEmpleado);
    }

    private actualizarHoras(data: HorasTrabajo) {
        this.trabajoSrv.putUpdateHoras(data).subscribe({
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

    formatofecha(fecha: Date) {
        return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public get f(): any {
        return this, this.myForm.controls;
    }

    formatofechaConsulta(fecha: Date) {
        return this.datepipe.transform(fecha, 'yyyy-MM-dd');
    }
}