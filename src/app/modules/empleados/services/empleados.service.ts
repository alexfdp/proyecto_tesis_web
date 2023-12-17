import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthToken } from 'src/app/models/AuthToken';
import { Empleado } from 'src/app/models/Empleado';
import { EmpleadoDAO } from 'src/app/models/EmpleadoDAO';
import { Puesto } from 'src/app/models/Puesto';
import { Rol } from 'src/app/models/Rol';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private getempleados = "empleados"
  private putEstadoEmpleado = "empleados/estado"
  private getvaluser = "empleados/validuser"
  private getpuestos = "public/puestos"
  private getroles = "public/roles"

  constructor(private http: HttpClient) { }

  public getAllEmpleados() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get<Empleado[]>(`${environment.apiUrl}/${this.getempleados}`, { headers });
  }

  public getUsuario(usuario: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post<any>(`${environment.apiUrl}/${this.getvaluser}`, { headers, usuario })
  }

  public getPuestos() {
    return this.http.get<Puesto[]>(`${environment.apiUrl}/${this.getpuestos}`);
  }

  public getRoles() {
    return this.http.get<Rol[]>(`${environment.apiUrl}/${this.getroles}`);
  }

  public putEmpleado(empleado: Empleado): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${this.getempleados}`, empleado)
  }

  public postEmpleado(dataEmployee: EmpleadoDAO): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.getempleados}`, dataEmployee);
  }

  public putEstado(dataEmployee:Empleado): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${this.putEstadoEmpleado}`, dataEmployee)
  }
}
