import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  public olympicsNb: number = 0; 
  public countriesNb: number = 0;
  public getScreenWidth: number = window.innerWidth;

  private pieLabelPlacement: string = "";
  private dataPoints: Array<{}> = [];
  

  constructor(private olympicService: OlympicService, private router: Router) {}


  ngOnInit() {
    this.olympicService.getOlympics().pipe(take(2)).subscribe((x)=> this.getValuesForPie(x));
    this.onWindowResize();                // Initializing the pie indexLabelPlacement
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    this.getScreenWidth = window.innerWidth;
    this.getScreenWidth > 600? this.chartOptions.data[0].indexLabelPlacement="" : this.chartOptions.data[0].indexLabelPlacement="inside";     //To put labels inside the pie on small windows
  }

  /* chart options for pie chart */
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
      const totalMedals = this.olympicService.getTotalItemsOfParticipation(country.participations)[0];
      this.dataPoints.push({y: totalMedals, name: country.country, click: (event: any) => { this.onClick(event) }});
      this.countriesNb += 1;

      if(this.olympicsNb < country.participations.length){
        this.olympicsNb = country.participations.length;
      }
    }
    this.chartOptions.data[0].dataPoints = this.dataPoints;
  }

  /* 
    onClick(e) => method to get the country name of the pie part clicking and to call the getOlympicsByCountryName method of olympicService
    e: any => represent the object of the pie part clicking 
    (refer to : https://canvasjs.com/docs/charts/chart-options/data/datapoints/click/)
  */
  onClick(e: any){
    this.router.navigateByUrl(`details/${e.dataPoint.name}`);
  }
}
