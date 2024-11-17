import { Time } from "@angular/common"

export interface Trabajo {
    idtrabajo: number
    empleado_id: number
    hora_entrada: Time
    hora_salida: Time
    total_horas: number
}