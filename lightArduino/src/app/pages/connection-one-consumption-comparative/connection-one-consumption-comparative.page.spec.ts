import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionComparativePage } from './connection-one-consumption-comparative.page';

describe('ConnectionOneConsumptionComparativePage', () => {
  let component: ConnectionOneConsumptionComparativePage;
  let fixture: ComponentFixture<ConnectionOneConsumptionComparativePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionOneConsumptionComparativePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionOneConsumptionComparativePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
