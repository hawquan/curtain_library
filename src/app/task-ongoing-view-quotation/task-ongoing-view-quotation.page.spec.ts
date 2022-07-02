import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewQuotationPage } from './task-ongoing-view-quotation.page';

describe('TaskOngoingViewQuotationPage', () => {
  let component: TaskOngoingViewQuotationPage;
  let fixture: ComponentFixture<TaskOngoingViewQuotationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOngoingViewQuotationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOngoingViewQuotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
