import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TailorTaskDetailOngoingPage } from './tailor-task-detail-ongoing.page';

describe('TailorTaskDetailOngoingPage', () => {
  let component: TailorTaskDetailOngoingPage;
  let fixture: ComponentFixture<TailorTaskDetailOngoingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TailorTaskDetailOngoingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TailorTaskDetailOngoingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
