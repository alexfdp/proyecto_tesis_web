import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajo } from 'src/app/models/Horario';
import { HorasTrabajo } from 'src/app/models/HorasTrabajo';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrabajoService {
    private horarioById = "trabajo/horarioById"
    private updateHorarioById = "trabajo/udateHorario"
    private consultartrabajo = "trabajo/consultartrabajo"
    private generarRegistros = "trabajo/generarRegistros"
    private updateHorasTrabajadas = "trabajo/updateHorasTrabajadas"

    constructor(private http: HttpClient) { }

    public getHorarioByID(idempleado: number) {
        return this.http.post<Trabajo[]>(`${environment.apiUrl}/${this.horarioById}`, { idempleado });
    }

    public putHorario(data: any) {
        return this.http.put(`${environment.apiUrl}/${this.updateHorarioById}`, data);
    }

    public postHorasTrabajadas(fecha: any) {
        return this.http.post<HorasTrabajo[]>(`${environment.apiUrl}/${this.consultartrabajo}`, { fecha });
    }

    public putGenerarRegistros(fecha: any) {
        return this.http.put(`${environment.apiUrl}/${this.generarRegistros}`, { fecha });
    }

    public putUpdateHoras(horasEmpleado: HorasTrabajo): Observable<any> {
        return this.http.put(`${environment.apiUrl}/${this.updateHorasTrabajadas}`, { horasEmpleado });
    }

}

