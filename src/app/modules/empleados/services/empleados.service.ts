import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from 'src/app/models/Empleado';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private getempleados = "empleados"
  constructor(private http: HttpClient) { }

  public getAllEmpleados(){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get<Empleado[]>(`${environment.apiUrl}/${this.getempleados}`, { headers });
  }
}
