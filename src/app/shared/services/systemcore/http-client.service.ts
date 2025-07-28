import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LocalHttpClient {
  baseUrl = ''
  // baseUrlWithoutApi = 'http://192.119.126.210:8070';
  // baseUrlWithoutApi = 'http://192.119.126.210:4563'; //Demo
  baseUrlWithoutApi = 'http://localhost:5042';
// 
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = this.baseUrlWithoutApi + '/api/';
    // this.testToken().subscribe(z => {
    //   //console.log("TOKEN TESTED ");
    // })
  }

  getWithCustomOptions(url: any, options = {}) {
    return this.http.get(url, options);
  }
  testToken() {
    this.authenticatedHttp();
    return this.http.get(this.baseUrl + 'Account/testToken', this.httpOptions).pipe(
      catchError(x => this.handleAuthError(x, this.router))
    );
  }

  handleAuthError(err: any, router: any): any {
  }

  get(url: any, useCache = false) {
    this.authenticatedHttp();
    return this.http.get(this.baseUrl + url, this.httpOptions)
    // .pipe(
    //   tap(_ => /*console.log('Get Respponse', this.baseUrl + url)*/),
    // );
  }
  getWithObj(url: any, data: any) {
    this.authenticatedHttp();
    if (data) {
      Object.keys(data).forEach((key: any) => {
        if (!data[key] && data[key] != false && data[key] != 0) {
          delete data[key]
        }
      })
    }
    let queryString = Object.keys(data)
      .map(key => {
        if (Array.isArray(data[key])) {
          return data[key].map((arrVal: any) => `${encodeURIComponent(key)}=${encodeURIComponent(arrVal)}`).join('&');
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
        }
      })
      .join('&');

    return this.http.get(this.baseUrl + url + "?" + queryString, this.httpOptions)
  }
  getLanguage() {
    return localStorage.getItem("i18n_locale") ?? "en"
  }
  getTextContent(fileName: string) {
    return this.http.get(this.baseUrlWithoutApi + "/resources/" + fileName, { responseType: 'text' });
  }
  post(url: any, data: any) {
    this.authenticatedHttp();
    //console.log("Post Request", this.baseUrl + url, JSON.stringify(data));
    return this.http.post(this.baseUrl + url, data, this.httpOptions);
  }
  purePost(url: any, data: any) {
    //console.log("Post Request", url, JSON.stringify(data));
    return this.http.post(url, data, this.httpOptions);
  }
  delete(url: any, data: any) {
    this.authenticatedHttp();
    let strQueryString = "";
    let keys = Object.keys(data);
    keys.forEach((key, i) => {
      strQueryString += `${key}=${data[key]}`;
      if (i != (keys.length - 1)) {
        strQueryString += "&"
      }
    })

    //console.log("Post Request", this.baseUrl + url + "?" + strQueryString, JSON.stringify(data));
    return this.http.delete(this.baseUrl + url + "?" + strQueryString, this.httpOptions);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('DQWK32%423$'),
      })
    };
    this.httpOptions.headers = this.httpOptions.headers.append('g', localStorage.getItem('i18n_locale') ?? "en");
  }

}