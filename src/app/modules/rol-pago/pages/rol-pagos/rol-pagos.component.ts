import { Component } from '@angular/core';

@Component({
  selector: 'app-rol-pagos',
  templateUrl: './rol-pagos.component.html',
  styleUrls: ['./rol-pagos.component.scss']
})
export class RolPagosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'estadoPago', 'imprimir'];
  mes = 'noviembre';
}
