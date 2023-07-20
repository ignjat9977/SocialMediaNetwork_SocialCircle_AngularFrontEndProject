import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { UserListComponent } from './components/pages/user-list/user-list.component';
import { RootComponent } from './components/pages/root/root.component';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageGroupsComponent } from './components/pages/manage-groups/manage-groups.component';
import { ReportsComponent } from './components/pages/reports/reports.component';


const adminRoutes: Routes = [

  { path: 'admin', 
    component: RootComponent,
    children:[
      { path: 'users', component: UserListComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'manage-groups', component: ManageGroupsComponent },
      { path: 'reports', component: ReportsComponent },
    ]
  },
  
];

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    RootComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes)
  ],
  
  exports: [RouterModule]
})
export class AdminModule { }
