// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { DatePipe } from '@angular/common';
// import { StoreManagementService } from '../../Store/Store-Management.service';
// @Injectable({
//     providedIn: 'root'
// })
// export class AuthOperation {
//     constructor(private storeManagementService: StoreManagementService, private router: Router) {
//     }

//     tokenKey = "DQWK32%423$"
//     userKey = "CurrentUserInfo"
//     async saveAuth(c: any) {
//         await this.storeManagementService.removeItem("CurrentShiftId");
//         sessionStorage.setItem(this.tokenKey, c["token"]);
//         localStorage.setItem(this.userKey, JSON.stringify({ name: c["nameEn"], posDetails: c['posDetails'], logo: c['logo'], userType: c['userType'], type: c["type"], email: c['email'], branchId: c["branchId"], departmentId: c['departmentId'], permissions: c.permissions ? JSON.parse(c.permissions) : {}, otherSetup: c.otherSetup ? JSON.parse(c.otherSetup) : {} }))
//         localStorage.setItem("PDFSetup", JSON.stringify({ pdfMargins: c["pdfMargins"], pdfLetter: c["pdfLetter"] }))
//         this.storeManagementService.refreshCurrentLogin();
//         setTimeout(async () => {
//             var isPOS = await this.storeManagementService.IsPosVersion()
//             if (isPOS) {
//                 if (c['posDetails'].posIsFloorPos) {
//                     this.navigateTo('../floors')
//                 }
//                 else {
//                     this.navigateTo('../pos')
//                 }
//             }
//             else {
//                 this.navigateTo('../')
//                 setTimeout(() => {
//                     location.reload();
//                 }, 300);
//             }
//         }, 10);
//         this.loadCurrentUserInfo()
//         setTimeout(() => {
//             this.refreshNavs()
//         }, 100);

//     }
//     navigateTo(link: string, queryParams: any = {}) {
//         if (link)
//             this.router.navigate([link], {
//                 queryParams: queryParams,
//             })
//     }
// }