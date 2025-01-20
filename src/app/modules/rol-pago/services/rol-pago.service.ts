import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmpleadoRol } from 'src/app/models/EmpleadoRol';
import { RolEmpleado } from 'src/app/models/RolEmpleado';

@Injectable({
    providedIn: 'root'
})
export class RolPagoService {
    private consultarRolesPago = "rol_pago/consultarRolesPago"
    private generarRolesPago = "rol_pago/generarRolesPago"
    private consultarRolEmpleado = "rol_pago/consultarRolEmpleado"

    constructor(private http: HttpClient) { }

    public postListRoles(mes: number, anio: number) {
        return this.http.post<EmpleadoRol[]>(`${environment.apiUrl}/${this.consultarRolesPago}`, { mes, anio });
    }

    public getgenerarRolesPago() {
        return this.http.get<any>(`${environment.apiUrl}/${this.generarRolesPago}`);
    }

    public postRolEmpleado(idempleado:number, mes: number, anio: number) {
        return this.http.post<RolEmpleado>(`${environment.apiUrl}/${this.consultarRolEmpleado}`, { idempleado, mes, anio });
    }
    // public
}
