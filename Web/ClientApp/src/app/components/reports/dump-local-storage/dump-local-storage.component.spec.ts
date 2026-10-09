import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpLocalStorageComponent } from './dump-local-storage.component';

describe('DumpLocalStorageComponent', () => {
  let component: DumpLocalStorageComponent;
  let fixture: ComponentFixture<DumpLocalStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DumpLocalStorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpLocalStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
