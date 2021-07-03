import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionsConfigSchedulePage } from './connections-config-schedule.page';

describe('ConnectionsConfigSchedulePage', () => {
  let component: ConnectionsConfigSchedulePage;
  let fixture: ComponentFixture<ConnectionsConfigSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionsConfigSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionsConfigSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
