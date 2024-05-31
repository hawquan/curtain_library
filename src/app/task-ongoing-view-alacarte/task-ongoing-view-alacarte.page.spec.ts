import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewAlacartePage } from './task-ongoing-view-alacarte.page';

describe('TaskOngoingViewAlacartePage', () => {
  let component: TaskOngoingViewAlacartePage;
  let fixture: ComponentFixture<TaskOngoingViewAlacartePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOngoingViewAlacartePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOngoingViewAlacartePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
