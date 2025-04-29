import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  notificaciones: any[] = [];

  

  constructor(private router:Router,
              private apiService: ApiService
  ){};

  ngOnInit(): void {
    this.cargarNotificaciones();
  }



  cargarNotificaciones() {
    this.apiService.get<any>('notificaciones/').subscribe({
      next: (data) => {
        this.notificaciones = data.results;
        console.log('Notificaciones obtenidas:', data);
      },
      error(err) {
        console.error('Error al obtener notificaciones', err);
      }
    });
  }
  

  get noLeidas(): number {
    return this.notificaciones.filter(n => !n.leido).length;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    localStorage.removeItem('usuario');
    localStorage.removeItem('redireccionPendiente');
    localStorage.removeItem('carrito'); // opcional
  
    // Redirigís al usuario al catálogo o login
    this.router.navigate(['/dashboard']);
  }

  hayToken(): boolean {
    return !!localStorage.getItem('token');
  }
}