import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsjTotalesComponent } from './msj-totales.component';

describe('MsjTotalesComponent', () => {
  let component: MsjTotalesComponent;
  let fixture: ComponentFixture<MsjTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsjTotalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsjTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
