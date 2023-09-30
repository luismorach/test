import { Component} from '@angular/core';
import { tap } from 'rxjs';
import {ComunicatorComponetsService}from '../../../services/comunicator/comunicator-componets.service';
@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.css']
})
export class NavTopComponent {

  show!:boolean;
  constructor(private comunicatorSvc:ComunicatorComponetsService){}

  ngOnInit(){
    this.comunicatorSvc.getShowHideNavBar()
    .pipe(tap(res=>this.show=res))
    .subscribe();
  }
  
  showHideNavBar(){
     this.show=!this.show; 
    this.comunicatorSvc.setshowHideNavBar(this.show); 
  }
}
