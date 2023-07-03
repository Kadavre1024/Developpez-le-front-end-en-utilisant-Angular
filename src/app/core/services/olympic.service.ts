import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, OperatorFunction} from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private jsonLinkError: string = "The JSON file can't be found";

  constructor(private http: HttpClient, private router:Router) {  }


  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      take(1),
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        if(!this.isValidJSON(this.jsonLinkError)){
          this.redirectOnNotFoundPage(this.jsonLinkError);
          return this.olympics$;
        }
        console.error("ERROR : ", error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  isValidJSON(strJson: string): boolean {
    try {
      const parsed = JSON.parse(strJson)
      if (parsed && typeof parsed === "object") {
        return true
      }
    } catch { return false }
    return false
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }

  getOlympicsByCountryName(countryName: string): Observable<OlympicCountry>{
    this.router.navigateByUrl(`country/${countryName}`);
    return this.olympics$.asObservable().pipe(
      map(values => values.filter(value => value.country === countryName)[0]),
    );
  }

  redirectOnNotFoundPage(message: string) {
    this.router.navigateByUrl(`**/${message}`);
  }

  
}
