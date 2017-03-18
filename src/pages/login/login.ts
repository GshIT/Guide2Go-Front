import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  constructor(private menu: MenuController) {}

  ionViewDidEnter() {
      this.menu.enable(false);
    }
}
