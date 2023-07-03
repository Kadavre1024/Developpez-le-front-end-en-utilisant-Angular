import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlympicCountryPageComponent } from './olympic-country-page.component';

describe('OlympicCountryPageComponent', () => {
  let component: OlympicCountryPageComponent;
  let fixture: ComponentFixture<OlympicCountryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlympicCountryPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlympicCountryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
