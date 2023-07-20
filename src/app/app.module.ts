import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LightgalleryModule } from 'lightgallery/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepicker, NgbInputDatepicker , NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/pages/home/home.component';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { IndexComponent } from './components/pages/index/index.component';
import { PostComponent } from './components/shared/post/post.component';
import { CommentComponent } from './components/shared/comment/comment.component';
import { DatePipe } from '@angular/common';
import { FriendComponent } from './components/shared/friend/friend.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { ImagePipePipe } from './pipes/image-pipe.pipe';
import { BootstrapModalComponent, NgbdModalComponent } from './components/shared/bootstrap-modal/bootstrap-modal.component';
import { VideoOrPhotoPipe } from './pipes/video-or-photo.pipe';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { MessagesComponent } from './components/pages/messages/messages.component';
import { InboxPartComponent } from './components/shared/inbox-part/inbox-part.component';
import { InboxMessagesComponent } from './components/shared/inbox-messages/inbox-messages.component';
import { SearchComponent } from './components/pages/search/search.component';
import { UsersComponent } from './components/pages/users/users.component';
import { GroupsComponent } from './components/pages/groups/groups.component';
import { GroupsService } from './services/groups/groups.service';
import { SingleGroupComponent } from './components/pages/single-group/single-group.component';
import { IsMessageNotificationExistPipe } from './pipes/is-message-notification-exist.pipe';
import { AdminModule } from './admin/admin.module';
import { UserListComponent } from './admin/components/pages/user-list/user-list.component';
import { DashboardComponent } from './admin/components/pages/dashboard/dashboard.component';
import { ManageGroupsComponent } from './admin/components/pages/manage-groups/manage-groups.component';
import { ReporModalComponent } from './components/shared/repor-modal/repor-modal.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
@NgModule({
    declarations: [
        AppComponent,
        SignUpComponent,
        HomeComponent,
        MyProfileComponent,
        IndexComponent,
        PostComponent,
        CommentComponent,
        FriendComponent,
        UserProfileComponent,
        ImagePipePipe,
        VideoOrPhotoPipe,
        NotFoundComponent,
        MessagesComponent,
        InboxPartComponent,
        InboxMessagesComponent,
        SearchComponent,
        UsersComponent,
        GroupsComponent,
        SingleGroupComponent,
        IsMessageNotificationExistPipe,
        UserListComponent,
        DashboardComponent,
        ManageGroupsComponent,
        ReporModalComponent,
        SettingsComponent
        
    ],
    providers: [DatePipe, GroupsService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        NgbPaginationModule,
        NgbAlertModule,
        NgbDatepicker,
        NgbInputDatepicker,
        ReactiveFormsModule,
        HttpClientModule,
        NgbPagination,
        NgbdModalComponent,
        AdminModule,
        LightgalleryModule
    ]
})
export class AppModule { }
