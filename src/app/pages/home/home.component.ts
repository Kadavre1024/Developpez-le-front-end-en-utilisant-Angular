import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  private dataPoints: Array<{}> = [];
  public olympicCountry!: OlympicCountry; 
  public getScreenWidth: any;
  public getScreenHeight: any;
  private pieLabelPlacement: string = "";
  private destroy$!: Subject<boolean>;
  

  constructor(private olympicService: OlympicService) {}


  ngOnInit() {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(x=> this.getValuesForPie(x));
    
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.getScreenWidth > 600? this.chartOptions.data[0].indexLabelPlacement="" : this.chartOptions.data[0].indexLabelPlacement="inside";
  }

  chartOptions = {
    animationEnabled: true,
    title: {},
    data: [{
    type: "pie",
    startAngle: -90,
    indexLabel: "{name}",
    indexLabelPlacement: this.pieLabelPlacement,
    yValueFormatString: "#,###.## 🥇",
    dataPoints: this.dataPoints,
    }]
  }

  getValuesForPie(olympicCountry: OlympicCountry[]): void {
    for(let country of olympicCountry){
      const totalMedals = this.getTotalMedals(country.participations);
      this.dataPoints.push({y: totalMedals, name: country.country, click: this.onClick});
    }
    this.chartOptions.data[0].dataPoints = this.dataPoints;
  }

  getTotalMedals(participation: Participation[]) : number {
    let totalMedals = 0;
    for (let i of participation){
        totalMedals += i.medalsCount;
    }
    return totalMedals

  }

  onClick(e: any){
    console.log(e);
    console.log( "country : " + e.dataPoint.name)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
