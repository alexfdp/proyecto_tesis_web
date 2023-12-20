import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss']
})
export class CambiarClaveComponent {

  constructor(private routerprd: Router) {
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('estate');
    this.routerprd.navigateByUrl("/login")
  }
}
