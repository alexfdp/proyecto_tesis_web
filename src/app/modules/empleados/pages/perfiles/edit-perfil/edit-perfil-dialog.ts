import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import generator from 'generate-password-ts';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EmpleadosService } from '../../../services/empleados.service';
import { Usuario } from 'src/app/models/Usuario';
import { Rol } from 'src/app/models/Rol';
@Component({
    selector: 'edit-perfil-dialog',
    templateUrl: 'edit-perfil-dialog.html',
    styleUrls: ['../perfiles.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatDialogModule, ReactiveFormsModule,
        MatInputModule, FormsModule, CommonModule, MatDividerModule
    ],
})
export class EditPerfilDialog {

    public myForm!: FormGroup;
    validauser = true;
    usuario !: Usuario
    roles!: Rol[]
    rol_id = 0
    opcionrol = ""

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditPerfilDialog>,
        private fb: FormBuilder, private empleadosrv: EmpleadosService,) {
        this.usuario = data.usuario;
        this.roles = data.roles;
        this.opcionrol = this.roles.find(rol => rol.idrol === this.usuario.rol_id)?.descripcion || '';
        this.rol_id = this.roles.find(rol => rol.idrol === this.usuario.rol_id)?.idrol || 0;
        this.myForm = this.createMyForm();
        this.myForm.controls['nombre'].disable();
    }

    public get f(): any {
        return this, this.myForm.controls;
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
            nombre: [this.usuario.nombre],
            fecha_registro: [''],
            usuario: [this.usuario.usuario, [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑ0-9_]*')]],
            rol: [this.opcionrol],
            rol_id: [this.rol_id]
        });
    }

    capturar_rol() {
        this.rol_id = this.roles.find(rol => rol.descripcion === this.f.rol.value)?.idrol || 0;
        this.f.rol_id.value = this.rol_id;
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

    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}