import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { Router } from '@angular/router';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private jsonLinkError: string = "The data file can't be found";

  constructor(private http: HttpClient, private router:Router) {  }


  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        if(!this.isValidJSON(this.jsonLinkError)){
          this.redirectOnNotFoundPage(this.jsonLinkError);
          console.error("JSON ERROR : " + this.jsonLinkError + " at the address " + this.olympicUrl);
          return this.olympics$;
        }
        console.error("ERROR : ", error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  isValidJSON(strJson: string): boolean {
    let olympicModel: OlympicCountry[] = [];
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

  getTotalItemsOfParticipation(participation: Participation[]) : number[] {
    let totalMedals = 0;
    let totalAthletes = 0;
    for (let i of participation){
      totalMedals += i.medalsCount;
      totalAthletes += i.athleteCount;
    }
    const tabTotals = [];
    tabTotals.push(totalMedals, totalAthletes);
    return tabTotals;
  }

  redirectOnNotFoundPage(message: string) {
    this.router.navigateByUrl(`**/${message}`);
  }
}
