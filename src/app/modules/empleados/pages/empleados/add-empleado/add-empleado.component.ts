import { CommonModule, DatePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { EmpleadoDAO } from "src/app/models/EmpleadoDAO";
import { Puesto } from "src/app/models/Puesto";
import generator from 'generate-password-ts';
import { EmpleadosService } from "../../../services/empleados.service";
import * as moment from "moment";
import Swal from "sweetalert2";

/* Dialog para agregar nuevo empleado */
@Component({
    selector: 'add-empleado-dialog',
    templateUrl: 'add-empleado-dialog.html',
    styleUrls: ['../empleados.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, ReactiveFormsModule,
        BsDatepickerModule, MatDividerModule],
})
export class AddEmpleadoDialog {
    public myForm!: FormGroup;
    public puestos!: Puesto[]
    validauser = true;
    private empleado!: EmpleadoDAO
    opcionSlect = ""
    sueldo = 0
    fechamac !: Date
    fechamin !: Date

    constructor(public dialogRef: MatDialogRef<AddEmpleadoDialog>, private fb: FormBuilder,
        private empleadosrv: EmpleadosService, private miDatePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any, private bsLocaleService: BsLocaleService) {
        this.puestos = data.puestos;
        this.bsLocaleService.use('es');//fecha en español, datepicker 
        this.sueldo = this.puestos[0].sueldo
        this.opcionSlect = this.puestos[0].descripcion;
        this.fechamac = moment().subtract(59, 'year').toDate();
        this.fechamin = moment().subtract(18, 'year').toDate();
        this.myForm = this.createMyForm();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.empleadosrv.getUsuario(filterValue).subscribe({
            next: (data) => {
                this.validauser = true
            },
            error: (response) => {
                this.validauser = false
                var msg = response["error"]["message"]
                console.log("Error de la API: " + msg);
            }
        })
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
            sueldo: [this.sueldo, [Validators.required, Validators.min(0)]],
            puesto: [this.opcionSlect],
            fecha_nacimient: ['', [Validators.required]],
            fecha_ingres: ['', [Validators.required]],
            usuario: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑ0-9_]*')]],
        });
    }

    onValueChanges(event: KeyboardEvent): void {
        const keyCode = event.key.charCodeAt(0)
        if (keyCode < 47 || keyCode > 57) {
            event.preventDefault();
        }
    }

    public get f(): any {
        return this, this.myForm.controls;
    }

    capturar() {
        this.opcionSlect = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.descripcion;
        this.sueldo = this.puestos.find(puesto => puesto.descripcion === this.f.puesto.value)!.sueldo;
        this.f.sueldo.value = this.sueldo;
        this.myForm.controls['sueldo'].setValue(this.sueldo);
        // this.myForm.controls['sueldo'].add;
    }

    submitFormulario() {
        if (this.myForm.invalid || !this.validauser) {
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
        this.empleado.rol_id = this.empleado.puesto_id
        //this.empleado.contrasena = password
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