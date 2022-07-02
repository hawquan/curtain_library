import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewDetailsPage } from './task-ongoing-view-details.page';

describe('TaskOngoingViewDetailsPage', () => {
  let component: TaskOngoingViewDetailsPage;
  let fixture: ComponentFixture<TaskOngoingViewDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOngoingViewDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOngoingViewDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
