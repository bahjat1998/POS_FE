import { Injectable } from '@angular/core';
import { LocalHttpClient } from '../systemcore/http-client.service';
import { Observable, delay, from, of, switchMap, tap } from 'rxjs';
import { CommonOperationsService } from '../systemcore/third-partytoasty.service';
import { CacheService } from '../systemcore/cashe.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  mainRoute = "Management";
  constructor(private http: LocalHttpClient, private common: CommonOperationsService, private cacheService: CacheService) { }
  GetCompanyInfo(obj: any): Observable<any> {
    return of({
      lockTableImg: 'lockTableIcon.png',
      selectTableImg: 'selectTable.png'
    });
    return this.http.post(`${this.mainRoute}/GetFloorsData`, obj);
  }
  AddDepartment(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddDepartment`, obj);
  }
  DepartmentDetails(id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/DepartmentDetails?id=${id}`);
  }
  DepartmentsList(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/DepartmentsList`, req);
  }

  AddItem(req: any): Observable<any> {
    this.cacheService.remove("__ItemListWithDetails__")
    return this.http.post(`${this.mainRoute}/AddItem`, req);
  }
  ItemDetails(Id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/ItemDetails?Id=${Id}`);
  }
  ItemsList(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/ItemsList`, req);
  }
  PosItemsSearch(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/PosItemsSearch`, req);
  }
  ItemListWithDetails(req: any): Observable<any> {
    let cacheKey = '__ItemListWithDetails__';
    const keys = Object.keys(req).sort();
    for (const key of keys) {
      cacheKey += `_${key}:${req[key]}`;
    }
    return from(this.cacheService.get(cacheKey)).pipe(
      switchMap(cachedData => {
        if (cachedData !== null) {
          return of(cachedData);
        }

        return from(this.http.getWithObj(`${this.mainRoute}/ItemListWithDetails`, req)).pipe(
          tap(data => this.cacheService.set(cacheKey, data))
        );
      })
    );
  }
  async ItemListWithDetailsForInvoice(req: any) {
    let data = await this.cacheService.getItemsBasedSelectedItems(req);
    return { lstData: data ?? null };
  }
  async ItemListWithDetailsFromCache(req: any) {
    let data = await this.cacheService.getItemsBasedFilter(req);
    return { lstData: data ?? null };
  }
  async ItemListWithDetailsSearchFromCache(req: any) {
    let data = await this.cacheService.getItemsBasedFilter(req);
    return { lstData: data ?? null };
  }
  LoadAllItemsAndCacheIt(req: any): Observable<any> {
    let cacheKey = '__AllItems__';
    if (req.force) {
      return from(this.http.getWithObj(`${this.mainRoute}/ItemListWithDetails`, req)).pipe(
        tap(data => this.cacheService.set(cacheKey, data))
      );
    }
    else {
      return from(this.cacheService.get(cacheKey)).pipe(
        switchMap(cachedData => {
          if (cachedData !== null) {
            return of(true);//No need to return these items
          }
          return from(this.http.getWithObj(`${this.mainRoute}/ItemListWithDetails`, req)).pipe(
            tap(data => this.cacheService.set(cacheKey, data))
          );
        })
      );
    }
  }
  ItemListWithDetailsSearch(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/ItemListWithDetails`, req)
  }
  AddInvoice(req: any): Observable<any> {
    console.log("Order Submitted")
    return this.http.post(`${this.mainRoute}/AddInvoice`, req);
  }
  SplitInvoiceCommands(req: any): Observable<any> {
    console.log("Order Submitted")
    return this.http.post(`${this.mainRoute}/SplitInvoiceCommands`, req);
  }
  InvoiceCommands(req: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/InvoiceCommands`, req);
  }
  InvoiceDetails(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/InvoiceDetails`, req);
  }
  GetDeliveryCustomer(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/GetDeliveryCustomer`, req);
  }
  InvoiceReportQuery(Id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/InvoiceReportQuery?Id=${Id}`);
  }
  InvoiceList(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/InvoiceList`, req);
  }
  PosSoldItems(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/PosSoldItems`, req);
  }
  StockReport(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/StockReport`, req);
  }
  EarningReportQuery(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/EarningReportQuery`, req);
  }
  DebitsListQuery(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/DebitsListQuery`, req);
  }


  take(arr: any, n: number) {
    return arr.filter((_: any, index: any) => index < n);
  }
  skip(arr: any, n: number) {
    return arr.filter((_: any, index: any) => index >= n);
  }


  readLocal(key: string) {
    let data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    else return null
  }
  setLocal(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
