import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { CommonOperationsService } from "../services/systemcore/third-partytoasty.service";
import { StoreManagementService } from "../Store/Store-Management.service";
@Injectable({ providedIn: 'root' })
export class UserGuard {
  constructor(private common: CommonOperationsService, private storeManagementService: StoreManagementService) {

  }
  async canActivate(route: ActivatedRouteSnapshot) {
    console.log("const roles = route.data['roles'];", route.data['roles'])
    let isAuthed = sessionStorage.getItem("DQWK32%423$") ? true : false;
    isAuthed = isAuthed && !(await this.storeManagementService.IsPosVersion())
    if (!isAuthed) {
      this.common.logout()
    }
    return isAuthed;
  }
}
