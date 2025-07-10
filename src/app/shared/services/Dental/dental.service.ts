import { Injectable } from '@angular/core';
import { LocalHttpClient } from '../systemcore/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DentalService {
  
  mainRoute = "dental";
  constructor(private http: LocalHttpClient) { }
  // VisitPatientDetails(obj: any): Observable<any> {
  //   return this.http.getWithObj(`${this.mainRoute}/VisitPatientDetails`, obj);
  // }
  // AddCategory(obj: any): Observable<any> {
  //   return this.http.post(`${this.mainRoute}/AddSystemLookupCategory`, obj);
  // }
  
  AddAppointmentSetup(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddAppointmentSetup`, obj);
  }
  AppointmentSetupDetails(obj: any): Observable<any> {
    //Cache
    return this.http.getWithObj(`${this.mainRoute}/AppointmentSetupDetails`, obj);
  }
  DoctorAvailableAppointments(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/DoctorAvailableAppointments`, obj);
  }
  GetDoctorAvailableAppointmentsQuery(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/GetDoctorAvailableAppointmentsQuery`, obj);
  }
  QuickCommands(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/QuickCommands`, obj);
  }
  AddVisit(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddVisit`, obj);
  }
  VisitDetails(req: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/VisitDetails`, req);
  }
  QuickQueries(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/QuickQueries`, obj);
  }
  VisitList(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/VisitList`, obj);
  }
  AccountStatement(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/AccountStatement`, obj);
  }
  VisitPatientDetails(PatientId: any, VisitId: any = ''): Observable<any> {
    return this.http.get(`${this.mainRoute}/VisitPatientDetails?PatientId=${PatientId}&VisitId=${VisitId}`);
  }



  AddAppointment(obj: any): Observable<any> {
    return this.http.post(`${this.mainRoute}/AddAppointment`, obj);
  }
  AppointmentDetail(Id: any): Observable<any> {
    return this.http.get(`${this.mainRoute}/AppointmentDetail?Id=${Id}`);
  }
  AppointmentList(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/AppointmentList`, obj);
  }
  PatientLastVisitsList(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/PatientLastVisitsList`, obj);
  }
  DashboardMain(obj: any): Observable<any> {
    return this.http.getWithObj(`${this.mainRoute}/DashboardMain`, obj);
  }


  getSvgContent(fileName: string): Observable<string> {
    return this.http.getTextContent(fileName);
  }

}
