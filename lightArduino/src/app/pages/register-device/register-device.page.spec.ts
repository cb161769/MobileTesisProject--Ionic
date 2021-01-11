import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterDevicePage } from './register-device.page';

describe('RegisterDevicePage', () => {
  let component: RegisterDevicePage;
  let fixture: ComponentFixture<RegisterDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterDevicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
