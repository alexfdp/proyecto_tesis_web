import { Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  valid = true;
  verMenu() {
    this.valid = !this.valid;
  };
}