import { Injectable } from '@angular/core';
import { LocalHttpClient } from '../systemcore/http-client.service';
import { Observable, delay, from, of, switchMap, tap } from 'rxjs';
import { CommonOperationsService } from '../systemcore/third-partytoasty.service';
import { CacheService } from '../systemcore/cashe.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  mainRoute = "Accounting";
  constructor(private http: LocalHttpClient, private common: CommonOperationsService, private cacheService: CacheService) { }

  AddFloor(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddFloor`, obj);
  }
  FloorDetails(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/FloorDetails`, req);
  }
  FloorsList(req: any): Observable<any> {
    let cacheKey = `__Floors__`;
    return from(this.cacheService.get(cacheKey)).pipe(
      switchMap(cachedData => {
        if (cachedData !== null) {
          return of(cachedData);
        }

        return from(this.http.getWithObj(`${this.mainRoute}/FloorsList`, req)).pipe(
          tap(data => {
            this.cacheService.set(cacheKey, data);
          })
        );
      })
    );
    // return this.http.getWithObj(`${this.mainRoute}/FloorsList`, req);
  }
  GetTablesStatuses(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/GetTablesStatuses`, req);
  }
  AddShift(req: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddShift`, req);
  }
  ShiftDetails(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/ShiftDetails`, req);
  }
  ShiftsList(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/ShiftsList`, req);
  }
  CommonAccountingQueries(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/CommonAccountingQueries`, req);
  }
}
