import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopOverConnectionsPage } from './pop-over-connections.page';

describe('PopOverConnectionsPage', () => {
  let component: PopOverConnectionsPage;
  let fixture: ComponentFixture<PopOverConnectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopOverConnectionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopOverConnectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
