import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalHttpClient } from '../systemcore/http-client.service';
import { CacheService } from '../systemcore/cashe.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  mainRoute = "Account";
  constructor(private http: LocalHttpClient, private cacheService: CacheService) { }

  Login(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/Login`, obj);
  }

  QuickAccountCommands(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/QuickAccountCommands`, obj);
  }
  QuickAccountQueries(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/QuickAccountQueries`, obj);
  }
  AddAccount(obj: any): Observable<any> {
    this.cacheService.remove("__AccountBasedUserType__")
    return this.http.post(`${this.mainRoute}/AddAccount`, obj);
  }
  AccountDetails(id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/AccountDetails?id=${id}`);
  }
  AddCompany(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddCompany`, obj);
  }
  CompanyDetails(req: any = {}): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/CompanyDetails`, req);
  }
  CompaniesList(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/CompaniesList`, req);
  }

  AccountList(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/AccountList`, obj);
  }
  GetPrintDetails(AccountId: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/GetPrintDetails?AccountId=${AccountId}`);
  }


  VoucherList(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/VoucherList`, obj);
  }
  VoucherDetails(id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/VoucherDetails?id=${id}`);
  }
  AddVoucher(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddVoucher`, obj);
  }

  AddPermissionGroups(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddPermissionGroups`, obj);
  }
  PermissionGroupsListQuery(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/PermissionGroupsListQuery`, req);
  }
}
