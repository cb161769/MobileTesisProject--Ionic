import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionOneActiosPage } from './connection-one-actios.page';

describe('ConnectionOneActiosPage', () => {
  let component: ConnectionOneActiosPage;
  let fixture: ComponentFixture<ConnectionOneActiosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionOneActiosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionOneActiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
