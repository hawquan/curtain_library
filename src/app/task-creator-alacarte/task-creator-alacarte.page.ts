import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-creator-alacarte',
  templateUrl: './task-creator-alacarte.page.html',
  styleUrls: ['./task-creator-alacarte.page.scss'],
})
export class TaskCreatorAlacartePage implements OnInit {

  item = {
    photos: [] as any,
    custom_bracket: false,
    custom_hook: false,
    custom_belt: false,
    custom_sheer_bracket: false,
    custom_sheer_hook: false,
    custom_sheer_belt: false,
    need_ladder: false,
    need_scaftfolding: false,
  } as any;
  
  constructor() { }

  ngOnInit() {
  }

}
