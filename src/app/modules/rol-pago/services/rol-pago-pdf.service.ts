import { DecimalPipe } from '@angular/common';
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
        doc.text(`Rol de Pagos ${resultado}`, 65, 20);

        let yPosition = 30;

        doc.text(`Nombre:`, 10, yPosition);
        doc.text(payrollData.empleado.nombre, 150, yPosition, { align: 'center' });
        yPosition += 10;
        doc.text(`Cargo:`, 10, yPosition);
        doc.text(payrollData.empleado.nombre_cargo, 150, yPosition, { align: 'center' });
        yPosition += 20;
        doc.text(`Salario:`, 10, yPosition);
        doc.text(`${this.formatearNumero(payrollData.empleado.sueldo)}`, 160, yPosition, { align: 'right' });
        yPosition += 10;
        doc.text(`Descuento por horas no trabajadas:`, 10, yPosition);
        doc.text(`${this.formatearNumero(payrollData.empleado.descuento_horas_no_trabajadas)}`, 160, yPosition, { align: 'right' });
        yPosition += 10;
        doc.text(`Monto por horas extras:`, 10, yPosition);
        doc.text(`${this.formatearNumero(payrollData.empleado.monto_horas_extra)}`, 160, yPosition, { align: 'right' });
        yPosition += 10;
        payrollData.deduccionesGenerales.forEach((deduccion) => {
            if (deduccion.descripcion === 'Seguro Social') {
                yPosition += 10;
                doc.text(`Aporte IESS:`, 10, yPosition);
                doc.text(`${this.formatearNumero(deduccion.valor_deduccion)}`, 160, yPosition, { align: 'right' });
            } else {
                yPosition += 10;
                doc.text(`${deduccion.descripcion}:`, 10, yPosition);
                doc.text(`${this.formatearNumero(deduccion.valor_deduccion)}`, 160, yPosition, { align: 'right' });
            }
        });
        yPosition += 10;
        payrollData.deduccionesEmpleado.forEach((deduccion) => {
            yPosition += 10;
            doc.text(`${deduccion.descripcion}:`, 10, yPosition);
            doc.text(`${this.formatearNumero(deduccion.valor)}`, 160, yPosition, { align: 'right' });
        });
        yPosition += 10;
        payrollData.bonificacionesEmpleado.forEach((bonificacion) => {
            yPosition += 10;
            doc.text(`${bonificacion.descripcion}:`, 10, yPosition);
            doc.text(`${this.formatearNumero(bonificacion.monto_bonificacion)}`, 160, yPosition, { align: 'right' });
        });

        yPosition += 20;
        doc.text(`Líquido a pagar empleado:`, 10, yPosition);
        let sueldo_final = this.formatearNumero(payrollData.empleado.pago_neto);
        const textWidth = doc.getTextWidth(sueldo_final);
        doc.setFillColor(200, 200, 200); // Color de sombreado (gris claro) 
        doc.rect(160 - textWidth, yPosition - 6, textWidth, 10, 'F'); // Rectángulo detrás del texto 
        doc.text(`${sueldo_final}`, 160, yPosition, { align: 'right' });
        // Convertir el PDF a un Blob
        const pdfBlob = doc.output('blob');

        // Crear una URL para el Blob y abrirlo en una nueva pestaña
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);

    }

    formatearNumero(valor: number) {
        return valor.toFixed(2);
    }
}
