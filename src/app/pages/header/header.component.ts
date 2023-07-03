import { Component, OnInit } from '@angular/core';
import { Observable, of, take, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public olympicsheader$: Observable<OlympicCountry[]> = of([]);

  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.olympicsheader$ = this.olympicService.getOlympics();
    this.olympicsheader$.pipe(
      take(2),
      tap(x => x.sort((a:OlympicCountry, b:OlympicCountry) => a.country < b.country ? -1 : 1)),  
    ).subscribe();
  }

  onClick(countryName: string){
    this.olympicService.getOlympicsByCountryName(countryName);
  }
}
