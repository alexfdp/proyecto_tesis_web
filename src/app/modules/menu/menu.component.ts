import { Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core'
import { UserData } from 'src/app/models/UserData';
import { MenuValService } from './service/menu-val.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  valid = true;
  userdata!: UserData
  nombre = ""

  ngOnInit(): void {
    this.recogerdata()
  }

  constructor(private menuval: MenuValService, private routerprd: Router) { }

  verMenu() {
    this.valid = !this.valid;
  };

  recogerdata() {
    this.menuval.getUserData().subscribe({
      next: (data) => {
        this.userdata = data;
        this.nombre = this.userdata.nombre
        if (this.userdata.apellido) {
          this.nombre += this.userdata.apellido
        }
        if (this.userdata.apellido_2) {
          this.nombre += this.userdata.apellido_2
        }
        console.log(this.userdata);
      },
      error: (response: any) => {
        var msg = response["error"]["message"]
        console.log("mensaje api: " + msg);
        alert(msg);
        localStorage.removeItem("token");
        this.routerprd.navigateByUrl("/login")
      }
    })
  }
}