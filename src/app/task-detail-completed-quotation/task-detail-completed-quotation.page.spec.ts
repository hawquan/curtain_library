import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskDetailCompletedQuotationPage } from './task-detail-completed-quotation.page';

describe('TaskDetailCompletedQuotationPage', () => {
  let component: TaskDetailCompletedQuotationPage;
  let fixture: ComponentFixture<TaskDetailCompletedQuotationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailCompletedQuotationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailCompletedQuotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
