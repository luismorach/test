import { Component } from '@angular/core';
import { DashboardService } from './service/dashboard.service';
import { dashboard } from 'src/app/interfaces/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dashboard$!:Observable<dashboard[]>
  constructor(private dashboardSvc:DashboardService){}

  ngOnInit() {
    this.dashboard$=this.dashboardSvc.getdata()
  }
}
