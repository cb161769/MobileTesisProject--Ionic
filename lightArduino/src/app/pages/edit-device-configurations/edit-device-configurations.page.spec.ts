import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDeviceConfigurationsPage } from './edit-device-configurations.page';

describe('EditDeviceConfigurationsPage', () => {
  let component: EditDeviceConfigurationsPage;
  let fixture: ComponentFixture<EditDeviceConfigurationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeviceConfigurationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDeviceConfigurationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
