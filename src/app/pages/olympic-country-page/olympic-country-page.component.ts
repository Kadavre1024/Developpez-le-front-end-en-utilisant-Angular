import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorFunction, filter, map, take } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';


@Component({
  selector: 'app-olympic-country-page',
  templateUrl: './olympic-country-page.component.html',
  styleUrls: ['./olympic-country-page.component.scss']
})
export class OlympicCountryPageComponent implements OnInit {
  public countryName: string = "";

  public nbOfEntries: number = 0;
  public nbTotalMedals: number = 0;
  public nbTotalAthletes: number = 0;
  public chart!: any;						// chart declared as any => it takes the chart component object type in the getChartInstance() method but at this time takes any type

  private dataPoint: Array<{x: Date, y: number}> = [];


  constructor(private router: Router, private route: ActivatedRoute, private olympicService: OlympicService) {
    router.events.subscribe((val) => {													// on url change, update datas to show
		if (this.countryName !== this.route.snapshot.params['country']){
			this.updateDataPoints();
		}
	   });
	}

	ngOnInit(): void {}
	
	/* chart options for country line chart */
  
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
			xValueFormatString: "YYYY",
			yValueFormatString: "#,###",
			dataPoints: this.dataPoint
		}]

	});

	/* 
		getCharInstance() => method used by the line chart component (in olympic-country-page.html)
		to get the chart instance as an object and use the chart.render() method for updating datapoints.
		(refer to : https://canvasjs.com/angular-charts/dynamic-live-line-chart/)
	*/
	getChartInstance(chart: object){
		this.chart = chart;
	}
	
	getValuesForGraph(olympicCountry: OlympicCountry){
		this.nbOfEntries = 0;
		this.nbTotalAthletes = 0;
		this.nbTotalMedals = 0;
		this.dataPoint = [];

		this.nbOfEntries = olympicCountry.participations.length;
		[this.nbTotalMedals, this.nbTotalAthletes] = this.olympicService.getTotalItemsOfParticipation(olympicCountry.participations);

		for(let participation of  olympicCountry.participations){
			this.dataPoint.push({x: new Date(participation.year, 0, 1), y: participation.medalsCount});
		}
		this.chartOptions.data[0].dataPoints = this.dataPoint;
		if (this.chart){
			this.chart.render();
		}
	}

	updateDataPoints(){
		this.countryName = this.route.snapshot.params['country'];
		this.olympicService.getOlympics().pipe(
			take(2),
			map(values => values.filter(value => value.country === this.countryName)[0]),
			filter(x => x !== undefined) as OperatorFunction<OlympicCountry | undefined, OlympicCountry>,			// Filtering to get only datas as an OlympicCrountry object
			).subscribe((x) => this.getValuesForGraph(x));
	}
}
