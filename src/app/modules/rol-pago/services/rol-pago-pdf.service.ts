import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import { RolEmpleado } from 'src/app/models/RolEmpleado';

@Injectable({
    providedIn: 'root'
})
export class RolPagoPdfService {
    constructor() { }
    generatePayrollPdf(payrollData: RolEmpleado): void {
        const doc = new jsPDF();
        const fecha = new Date(payrollData.empleado.fecha_corte);
        console.log(fecha);
        const formateador = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
        const resultado = formateador.format(fecha);
        const nombreEmpresa = 'Iceberg S.A.';
        doc.text(nombreEmpresa, 90, 10);
        doc.text(`Rol de Pagos ${resultado}`, 60, 20);

        let yPosition = 30;

        doc.text(`NOMBRE:`, 10, yPosition);
        doc.text(payrollData.empleado.nombre, 50, yPosition);
        // doc.text(`CARGO: ${payrollData.empleado.cargo}`, 10, yPosition + 10);
        doc.text(`Salario: ${payrollData.empleado.sueldo}`, 10, yPosition + 10);
        yPosition += 20;

        // Convertir el PDF a un Blob
        const pdfBlob = doc.output('blob');

        // Crear una URL para el Blob y abrirlo en una nueva pestaña
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);

    }
}
