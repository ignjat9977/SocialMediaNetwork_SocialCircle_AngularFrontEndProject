import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroup } from 'src/app/interfaces/i-group';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { EventService } from 'src/app/services/events/event.service';
import { GroupService } from 'src/app/services/group/group.service';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent {
  groups: IPageResponse<IGroup> = { items: [], totalCount: 0, itemsPerPage: 0, currentPage: 0 };
  totalCount: number
  perPage: number
  page: number = 1
  isActive: boolean
  search: string
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.eventService.search$.subscribe(search => {
      if (search == undefined) {
        search = "";
      }
      this.search = search
      this.page = 1
      this.getGroups("?Keyword=" + this.search + "&Page=" + this.page);
    });
  }

  getGroups(keyword: string | null): void {
    this.isActive = true
    this.groups = { items: [], totalCount: 0, itemsPerPage: 0, currentPage: 0 }
    this.groupService.getAllGroups(keyword).subscribe({
      next: (data: IPageResponse<IGroup>) => {
        this.groups = data;
        if(data.items.length==0)
          this.isActive = false
        this.totalCount = data.totalCount;
        this.perPage = data.itemsPerPage;
        this.page = data.currentPage;
      },
      error: err => {
        // Handle the error
      }
    });
  }

  onPageChange(page: any) {
    this.page = page

    this.getGroups("?Keyword=" + this.search + "&Page=" + this.page);
  }
}

