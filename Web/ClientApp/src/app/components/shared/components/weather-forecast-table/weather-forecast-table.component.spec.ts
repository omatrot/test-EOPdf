import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherForecastTableComponent } from './weather-forecast-table.component';

describe('WeatherForecastTableComponent', () => {
  let component: WeatherForecastTableComponent;
  let fixture: ComponentFixture<WeatherForecastTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherForecastTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherForecastTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
