import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public olympicsheader$: Observable<OlympicCountry[]> = of([]);

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    this.olympicsheader$ = this.olympicService.getOlympics().pipe(
      tap(x => x.sort((a:OlympicCountry, b:OlympicCountry) => a.country < b.country ? -1 : 1)));
  }

  onClick(countryName: string){
    this.router.navigateByUrl(`details/${countryName}`);
  }
}
