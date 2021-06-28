import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionEvolutionPage } from './connection-one-consumption-evolution.page';

describe('ConnectionOneConsumptionEvolutionPage', () => {
  let component: ConnectionOneConsumptionEvolutionPage;
  let fixture: ComponentFixture<ConnectionOneConsumptionEvolutionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionOneConsumptionEvolutionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionOneConsumptionEvolutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
