import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionsPage } from './connection-one-consumptions.page';

describe('ConnectionOneConsumptionsPage', () => {
  let component: ConnectionOneConsumptionsPage;
  let fixture: ComponentFixture<ConnectionOneConsumptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionOneConsumptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionOneConsumptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
