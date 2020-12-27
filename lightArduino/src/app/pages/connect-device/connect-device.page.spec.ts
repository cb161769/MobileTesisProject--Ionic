import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectDevicePage } from './connect-device.page';

describe('ConnectDevicePage', () => {
  let component: ConnectDevicePage;
  let fixture: ComponentFixture<ConnectDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectDevicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
