import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckOverviewComponent } from './deck-overview.component';

describe('DeckOverviewComponent', () => {
  let component: DeckOverviewComponent;
  let fixture: ComponentFixture<DeckOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
