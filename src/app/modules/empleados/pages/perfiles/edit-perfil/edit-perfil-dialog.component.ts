import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import generator from 'generate-password-ts';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EmpleadosService } from '../../../services/empleados.service';
import { Usuario } from 'src/app/models/Usuario';
import { Rol } from 'src/app/models/Rol';
import Swal from 'sweetalert2';
@Component({
    selector: 'edit-perfil-dialog',
    templateUrl: 'edit-perfil-dialog.component.html',
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
    user = ''
    roles!: Rol[]
    rol_id = 0
    rol_ini = 0;
    opcionrol = ""
    valRol = false;
    valcambio = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditPerfilDialog>,
        private datepipe: DatePipe,
        private fb: FormBuilder, private empleadosrv: EmpleadosService,) {
        this.usuario = data.usuario;
        this.roles = data.roles;
        this.user = this.usuario.usuario;
        this.opcionrol = this.roles.find(rol => rol.idrol === this.usuario.rol_id)?.descripcion || '';
        this.rol_id = this.roles.find(rol => rol.idrol === this.usuario.rol_id)?.idrol || 0;
        this.rol_ini = this.rol_id
        if (this.rol_id != 0) {
            this.valRol = true
        }
        this.myForm = this.createMyForm();
        this.myForm.controls['nombre'].disable();
        this.myForm.controls['fecha_registro'].disable();
    }

    public get f(): any {
        return this, this.myForm.controls;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (this.user === filterValue) {
            this.validauser = true
        } else {
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
    }

    private createMyForm(): FormGroup {
        return this.fb.group({
            nombre: [this.usuario.nombre],
            fecha_registro: [this.formatofecha(this.usuario.fecha_registro)],
            usuario: [this.usuario.usuario, [Validators.required, Validators.maxLength(45), Validators.pattern('[a-zA-ZñÑ0-9_]*')]],
            rol: [this.opcionrol],
            rol_id: [this.rol_id],
            iduser: [this.usuario.iduser]
        });
    }

    capturar_rol() {
        this.valRol = true
        this.rol_id = this.roles.find(rol => rol.descripcion === this.f.rol.value)?.idrol || 0;
        this.f.rol_id.value = this.rol_id;
        this.myForm.controls['rol_id'].setValue(this.rol_id);
    }

    submitFormulario() {
        if (this.myForm.invalid || !this.validauser || !this.valRol) {
            console.log("Formulario inválido")
            Object.values(this.myForm.controls).forEach(control => {
                control.markAllAsTouched();
            });
            Swal.fire({
                title: 'Formulario inválido',
                icon: 'warning',
                text: 'LLene todos los campos correctamente',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if (this.user != this.myForm.get('usuario')!.value || this.rol_ini != this.myForm.get('rol_id')!.value) {
            const password = generator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                symbols: '_-.'
            });
            this.usuario = this.myForm.value;
            this.usuario.contrasena = password;
            Swal.fire({
                title: "¿Desea actualizar los datos?",
                showCancelButton: true,
                text: 'Tenga en cuenta que la contraseña será reestablecida y deberá ser actualizada una vez se inicie sesión.',
                icon: 'question',
                confirmButtonText: "Continuar",
                cancelButtonText: `Cancelar`
            }).then((result) => {
                if (result.isConfirmed) {
                    this.updateUser(this.usuario);
                }
            });
        } else {
            this.dialogRef.close();
            Swal.fire({
                title: 'No hay cambios detectados',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        }
    }

    updateUser(user: Usuario) {
        const texto = "<b>Usuario</b>: " + user.usuario + "<br><b>Contraseña</b>: " + user.contrasena
        this.empleadosrv.putUsuario(user).subscribe({
            next: (mensaje) => {
                console.log("Ok de API: " + mensaje.message)
                Swal.fire({
                    title: 'Datos actualizados correctamente',
                    icon: 'success',
                    html: texto,
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
}