import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from 'src/app/models/Empleado';
import { Puesto } from 'src/app/models/Puesto';
import { Rol } from 'src/app/models/Rol';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private getempleados = "empleados"
  private getpuestos = "public/puestos"
  private getroles = "public/roles"

  constructor(private http: HttpClient) { }

  public getAllEmpleados() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get<Empleado[]>(`${environment.apiUrl}/${this.getempleados}`, { headers });
  }

  public getPuestos() {
    return this.http.get<Puesto[]>(`${environment.apiUrl}/${this.getpuestos}`);
  }

  public getRoles() {
    return this.http.get<Rol[]>(`${environment.apiUrl}/${this.getroles}`);
  }
}
