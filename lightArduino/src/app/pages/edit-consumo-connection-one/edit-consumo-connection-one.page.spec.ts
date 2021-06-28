import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditConsumoConnectionOnePage } from './edit-consumo-connection-one.page';

describe('EditConsumoConnectionOnePage', () => {
  let component: EditConsumoConnectionOnePage;
  let fixture: ComponentFixture<EditConsumoConnectionOnePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConsumoConnectionOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditConsumoConnectionOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
