import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  private destroy$!: Subject<boolean>;

  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      tap(x => x.sort((a:any, b:any) => a.country < b.country ? -1 : 1)),  
    ).subscribe();
  }
}
