export interface EmpleadoRolDet {
    empleado_id: number
    idnomina: number
    nombre: string
    nombre_cargo: string
    nombre_departamento: string
    fecha_corte: Date
    sueldo: number
    descuento_horas_no_trabajadas: number
    monto_horas_extra: number
    pago_neto: number
}