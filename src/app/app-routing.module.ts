import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { IndexComponent } from './components/pages/index/index.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { MessagesComponent } from './components/pages/messages/messages.component';
import { SearchComponent } from './components/pages/search/search.component';
import { UsersComponent } from './components/pages/users/users.component';
import { GroupsComponent } from './components/pages/groups/groups.component';
import { SingleGroupComponent } from './components/pages/single-group/single-group.component';
import { AdminModule } from './admin/admin.module';
import { SettingsComponent } from './components/pages/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  {
    path: 'index',
    component: IndexComponent,
    children: [
      { 
        path: 'my-profile', 
        component: MyProfileComponent,
        
      },
      { 
        path: 'settings', 
        component: SettingsComponent,
        
      },
      { 
        path: 'home', 
        component: HomeComponent 
      },

      {
        path:'user-profile/:id/:isF',
        component: UserProfileComponent

      },
      {
        path:'messages',
        component: MessagesComponent
      },
      {
        path:'single-group/:id',
        component: SingleGroupComponent
      },
      {
        path:"search",
        component:SearchComponent,
        children:[
            {
              path:"users",
              component:UsersComponent
            },
            {
              path:"groups",
              component:GroupsComponent
            },
        ]
      }
    ]
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AdminModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

