import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-pago-cancelado',
  imports: [CommonModule,MaterialModule],
  templateUrl: './pago-cancelado.component.html',
  styleUrl: './pago-cancelado.component.scss'
})
export class PagoCanceladoComponent {
  constructor(private router: Router) {}

  volverAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAlInicio() {
    this.router.navigate(['/dashboard']);
  }
}
