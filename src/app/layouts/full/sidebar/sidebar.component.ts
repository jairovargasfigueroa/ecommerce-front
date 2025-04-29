import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  imports: [ TablerIconsModule, MaterialModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  rolUsuario: string = localStorage.getItem('rol') || '';
  sidebarItems: NavItem[] = [];
  
  constructor() {}
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void {
    this.sidebarItems = navItems.filter(item => {
      return !item.roles || item.roles.includes(this.rolUsuario);
    });
  }
}
