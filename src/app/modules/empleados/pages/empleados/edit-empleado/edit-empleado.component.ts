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

/* Dialog para agregar nuevo empleado */
@Component({
    selector: 'edit-empleado-dialog',
    templateUrl: 'edit-empleado-dialog.html',
    styleUrls: ['../empleados.component.scss'],
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
    cargo_id = 0
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
        this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.empleado.cargo)?.descripcion || '';
        this.cargo_id = this.puestos.find(puesto => puesto.descripcion === this.empleado.cargo)?.idcargo || 0;
        this.myForm = this.createMyForm();
        this.myForm.controls['nombre'].disable();
        this.myForm.controls['cedula'].disable();
        this.myForm.controls['fecha_nacimiento'].disable();
        this.myForm.controls['fecha_ingreso'].disable();
        //this.myForm.controls['usuario'].disable();
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
            puesto_id: [this.cargo_id],
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
        this.empleado.cargo_id = this.cargo_id;
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
        this.cargo_id = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.idcargo;
        this.f.sueldo.value = this.sueldo;
        this.myForm.controls['sueldo'].setValue(this.sueldo);
        this.f.puesto_id.value = this.cargo_id
    }

    formatofecha(fecha: Date) {
        return this.datepipe.transform(fecha, 'dd/MMM/yyyy');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}