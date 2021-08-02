import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input() x = 0;
  @Input() y = 0;
  @Input() isShow: boolean;
  @Input() tastoShow;
  @Input() tastoDelete;
  @Input() tastoEdit;

  @Output() tastoDeleteEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tastoEditEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tastoShowEmit: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public onLock(e): void {
    // console.log('lock');
  }

  public onUnLock(e): void {
    // console.log('unlock');
  }

  premutoShow(): void {
    this.tastoShowEmit.emit(new Date().toString());
  }

  premutoDelete(): void {
    this.tastoDeleteEmit.emit(new Date().toString());
  }

  premutoEdit(): void {
    this.tastoEditEmit.emit(new Date().toString());
  }
}
