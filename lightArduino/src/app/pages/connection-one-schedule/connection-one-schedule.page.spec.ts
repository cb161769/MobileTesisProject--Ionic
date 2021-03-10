import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionOneSchedulePage } from './connection-one-schedule.page';

describe('ConnectionOneSchedulePage', () => {
  let component: ConnectionOneSchedulePage;
  let fixture: ComponentFixture<ConnectionOneSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionOneSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionOneSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
