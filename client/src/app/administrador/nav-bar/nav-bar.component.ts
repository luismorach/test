import { Component } from '@angular/core';
import { ComunicatorComponetsService } from '../../services/comunicator/comunicator-componets.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})



export class navBar {
  subMenuAdministracion = false;
  subMenuProductos = false;
  subMenuCompras = false;
  subMenuVentas = false;
  subMenuDevoluciones = false;
  subMenuKardex = false;
  subMenuReportes = false;
  subMenuConfiguraciones = false;
  show!: boolean;
  info: String[]=[];
  constructor(private comunicatorSvc: ComunicatorComponetsService,private routes:Router) { }

  ngOnInit() {
    this.comunicatorSvc.getShowHideNavBar()
      .pipe(tap(res => this.show = res))
      .subscribe();
  }
 
  showHideNavBar(){
    this.show=!this.show;
    this.comunicatorSvc.setshowHideNavBar(this.show);
  }
  
  changeStyle(active: boolean) {
    const styles = {
      "background-color": active ? "blue" : "transparent",
    }
    return styles;
  }
  arrowStyle(active: boolean) {
    const styles = {
      "transform": active ? "rotate(180deg)" : "none"
    }
    return styles;
  }
}
