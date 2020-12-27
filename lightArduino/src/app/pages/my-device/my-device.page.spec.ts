import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyDevicePage } from './my-device.page';

describe('MyDevicePage', () => {
  let component: MyDevicePage;
  let fixture: ComponentFixture<MyDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDevicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
