import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskDetailRejectedReviewPage } from './task-detail-rejected-review.page';

describe('TaskDetailRejectedReviewPage', () => {
  let component: TaskDetailRejectedReviewPage;
  let fixture: ComponentFixture<TaskDetailRejectedReviewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailRejectedReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailRejectedReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
