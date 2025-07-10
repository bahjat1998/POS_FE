import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { LocalHttpClient } from '../systemcore/http-client.service';
import { CacheService } from '../systemcore/cashe.service';


@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  mainRoute = "AutoComplete";

  constructor(private http: LocalHttpClient, private cacheService: CacheService) {

  }
  toCacheLkps = ['DeliveryAreas', 'SavedCustomerPhones', 'ItemGroups', 'PaymentMethod', 'PaymentType', 'InvoiceCategories', 'Departments', 'AppointmentStatus', 'DeleteReason', 'DiscountTypes', 'Branch', 'VoucherReason', 'VisitStatus', 'DoseUnit', 'Radilogy', 'Gender', 'Bank'];

  Lookups(categoryCode: any, Id1 = '', Id2 = '', Id3 = '', IsDefaultSelected = '', Flag01 = ''): Observable<any> {
    // Check if the category code should be cached
    if (this.toCacheLkps.some((z: any) => z === categoryCode)) {
      // Retrieve cached data from IndexedDB asynchronously
      return from(this.cacheService.get(categoryCode)).pipe(
        switchMap(cachedData => {
          // If cached data exists, return it as an observable
          if (cachedData) {
            return of(cachedData);
          }

          // Otherwise, fetch data from the server and cache it
          return this.http
            .get(
              `${this.mainRoute}/Lookups?categoryCode=${categoryCode}&Id1=${Id1}&Id2=${Id2}&Id3=${Id3}&IsDefaultSelected=${IsDefaultSelected}&Flag01=${Flag01}`
            )
            .pipe(
              tap(data => this.cacheService.set(categoryCode, data)) // Cache the fetched data
            );
        })
      );
    }

    // If not caching, directly fetch from the server
    return this.http.get(
      `${this.mainRoute}/Lookups?categoryCode=${categoryCode}&Id1=${Id1}&Id2=${Id2}&Id3=${Id3}&IsDefaultSelected=${IsDefaultSelected}&Flag01=${Flag01}`
    );
  }

  LookupsWithObj(obj: any): Observable<any> {
    if (!obj || !obj.categoryCode) {
      // return throwError(() => new Error('Invalid input: categoryCode is required.'));
    }

    let cacheKey = `__${obj.categoryCode}__`;
    const keys = Object.keys(obj).filter(k => k !== 'categoryCode').sort();
    for (const key of keys) {
      cacheKey += `_${key}:${obj[key]}`;
    }

    return from(this.cacheService.get(cacheKey)).pipe(
      switchMap(cachedData => {
        if (cachedData !== null) {
          return of(cachedData);
        }

        return from(this.http.getWithObj(`${this.mainRoute}/Lookups`, obj)).pipe(
          tap(data => {
            this.cacheService.set(cacheKey, data);
          })
        );
      })
    );
  }


  AddCategory(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddSystemLookupCategory`, obj);
  }
  AddLookup(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddSystemLookup`, obj);
  }
  CategoryList(page: any, pageSize: any, strSearch: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/SystemLookupCategoryList?page=${page}&pageSize=${pageSize}&strSearch=${strSearch}`);
  }
  LookupList(CategoryId: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/SystemLookupsDetailsList?CategoryId=${CategoryId}`);
  }


  GetItemsListLkp(req: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/GetItemsListLkp`, req);
  }
}
