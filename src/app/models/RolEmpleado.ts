import { BonificacionEmpleado } from "./BonificacionEmpleado";
import { DeduccionesEmpleado } from "./DeduccionesEmpleado";
import { DeduccionesGenerales } from "./DeduccionesGenerales";
import { EmpleadoRolDet } from "./EmpleadoRolDet";

export interface RolEmpleado {
    empleado: EmpleadoRolDet
    deduccionesGenerales: DeduccionesGenerales[]
    deduccionesEmpleado: DeduccionesEmpleado[]
    bonificacionesEmpleado: BonificacionEmpleado[]
}