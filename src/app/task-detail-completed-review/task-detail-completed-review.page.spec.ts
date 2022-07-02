import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskDetailCompletedReviewPage } from './task-detail-completed-review.page';

describe('TaskDetailCompletedReviewPage', () => {
  let component: TaskDetailCompletedReviewPage;
  let fixture: ComponentFixture<TaskDetailCompletedReviewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailCompletedReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailCompletedReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
