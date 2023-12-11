import { Component, HostBinding, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core'
import { UserData } from 'src/app/models/UserData';
import { MenuValService } from './service/menu-val.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  valid = true;
  nombre = "";
  rol = "";
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
        // console.log(data);
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
        localStorage.removeItem("token");
        this.routerprd.navigateByUrl("/login")
      }
    })
  }

  logout(){
    
  }
}