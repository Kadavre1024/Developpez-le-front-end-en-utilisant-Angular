import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, OperatorFunction, filter, map, of, take, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts'; 
import { Chart } from 'canvasjs';

@Component({
  selector: 'app-olympic-country-page',
  templateUrl: './olympic-country-page.component.html',
  styleUrls: ['./olympic-country-page.component.scss']
})
export class OlympicCountryPageComponent {
  public olympicCountry$:Observable<OlympicCountry> = of();
  public olympicCountry!:OlympicCountry;
  public countryName$!: Observable<string>;
  public countryName!: string;

  private dataPoint: Array<{x: Date, y: number}> = [];
  public olympicCountryName!: string;
  public nbOfEntries!: number;
  public nbTotalMedals!: number;
  public nbTotalAthletes!: number;
  public chart!: any;

  



  constructor(private router: Router, private route: ActivatedRoute, private olympicService: OlympicService) {
    router.events.subscribe((val) => {				//on url change, update datas to show
		if (this.countryName !== this.route.snapshot.params['country']){
			this.getUpatedDatas();
			console.log("loaction1 : "+window.location.pathname)
		}
	   });
	}
  
	chartOptions = ({
		animationEnabled: true,
		theme: "light2",
		title: {
			text: ""
		},
		axisX: {
			valueFormatString: "YYYY",
			intervalType: "year",
			interval: 1
		},
		axisY: {
			title: "Medals",
		suffix: ""
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: function(e: any){
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else{
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type:"line",
			name: "Medals",
			showInLegend: true,
			yValueFormatString: "#,###",
			dataPoints: this.dataPoint
		}]

	});
	getChartInstance(chart: object){
		this.chart = chart;
	}
	
	getValuesForGraph(olympicCountry: OlympicCountry){
		this.nbOfEntries = 0;
		this.nbTotalAthletes = 0;
		this.nbTotalMedals = 0;
		this.dataPoint = [];

		this.nbOfEntries = olympicCountry.participations.length;
		for(let participation of  olympicCountry.participations){
		this.dataPoint.push({x: new Date(participation.year, 0, 1), y: participation.medalsCount});
		this.nbTotalAthletes += participation.athleteCount;
		this.nbTotalMedals += participation.medalsCount;
		}
		this.chartOptions.data[0].dataPoints = this.dataPoint;
		if (this.chart){
			this.chart.render();
		}
	}
	getUpatedDatas(){
		this.countryName = this.route.snapshot.params['country'];
		this.olympicCountry$ = this.olympicService.getOlympicsByCountryName(this.countryName);
		this.olympicCountry$.pipe(take(2),filter(x => x !== undefined) as OperatorFunction<OlympicCountry | undefined, OlympicCountry>).subscribe((x) => this.getValuesForGraph(x));
	}
}
