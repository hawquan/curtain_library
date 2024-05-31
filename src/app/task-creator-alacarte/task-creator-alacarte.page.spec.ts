import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskCreatorAlacartePage } from './task-creator-alacarte.page';

describe('TaskCreatorAlacartePage', () => {
  let component: TaskCreatorAlacartePage;
  let fixture: ComponentFixture<TaskCreatorAlacartePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreatorAlacartePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreatorAlacartePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
