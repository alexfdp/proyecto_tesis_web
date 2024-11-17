import { Component } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MenuValService } from './service/menu-val.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faIdCardClip, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { catchError, retry } from 'rxjs/operators';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  valid = true;
  nombre = "";
  rol = "";
  iconTurnsEmployees = faTimeline
  mode!: MatDrawerMode
  ngOnInit(): void {
    this.recogerdata()
  }

  constructor(private menuval: MenuValService, private routerprd: Router) {
    this.mode = 'side'
    window.addEventListener('resize', () => this.detectarTamañoVentana());
    this.detectarTamañoVentana();
  }

  detectarTamañoVentana() {
    const anchoVentana = window.innerWidth;
    if (anchoVentana <= 768) {
      this.mode = 'over';
    } else {
      this.mode = 'side';
    }
  }

  verMenu() {
    this.valid = !this.valid;
  };

  private recogerdata() {
    this.menuval.getUserData().subscribe({
      next: (data) => {
        this.nombre = data.nombre
        this.rol = data.rol
        if (data.apellido) {
          this.nombre += data.apellido
        }
        if (data.apellido_2) {
          this.nombre += data.apellido_2
        }
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
        Swal.fire({
          title: 'Error al consultar datos',
          text: 'Error: ' + msg.toUpperCase(),
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        this.logout()
      }
    })
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('estate');
    this.routerprd.navigateByUrl("/login")
  }
}