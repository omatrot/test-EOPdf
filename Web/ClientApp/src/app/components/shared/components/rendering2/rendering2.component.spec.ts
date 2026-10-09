import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rendering2Component } from './rendering2.component';

describe('Rendering2Component', () => {
  let component: Rendering2Component;
  let fixture: ComponentFixture<Rendering2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Rendering2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Rendering2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
