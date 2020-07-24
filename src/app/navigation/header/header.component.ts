import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('toggleSidenav') toggleSidenav: MatButton;
  @Output() public sidenavToggle = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
    // get access to nativeElement (the html object) and call blur (remove focus)
    this.toggleSidenav._elementRef.nativeElement.blur();
  }

}
