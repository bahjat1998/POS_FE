import { Component } from '@angular/core';
import { slideDownUp } from 'src/app/shared/animations';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.css'],
  animations: [slideDownUp]
})
export class PermissionGroupComponent {
  constructor(private accountService: AccountService, public common: CommonOperationsService) {
    this.PermissionGroupsListQuery()
  }

  AddNewGroup() {
    this.lstGroups.unshift({ _permissions: {}, dimId: this.common.makeid(4) })
  }

  lstGroups: any = []
  PermissionGroupsListQuery() {
    this.accountService.PermissionGroupsListQuery({}).subscribe(z => {
      this.lstGroups = z ?? [];

      // this.lstGroups.forEach((z: any) => {
      //   if (z['lstPermissions']) {
      //     z['_permissions'] = JSON.parse(z['lstPermissions'])
      //   } else {
      //     z['_permissions'] = {}
      //   }
      // });
    })

  }

  save() {
    this.lstGroups.forEach((g: any) => {
      if (g['_permissions']) {
        g['lstPermissions'] = JSON.stringify(g['_permissions'])
      }
    });

    this.accountService.AddPermissionGroups({ lstPermissions: this.lstGroups }).subscribe(z => {
      this.common.success("Saved Successfully!")
    })
  }
  selectedGroup: any = ''
  selectGroup(g: any) {
    this.selectedGroup = this.selectedGroup == this.getGid(g) ? '' : this.getGid(g);
  }

  getGid(g: any) {
    return g.id ?? g.dimId;
  }


  model: any = {}
}
