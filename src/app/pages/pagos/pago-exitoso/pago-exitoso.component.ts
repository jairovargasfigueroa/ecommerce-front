import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-pago-exitoso',
  imports: [CommonModule,MaterialModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.scss'
})
export class PagoExitosoComponent {
  constructor(private router: Router) {}

  irAMisPedidos() {
    this.router.navigate(['/mis-pedidos']);
  }

  irAlInicio() {
    this.router.navigate(['/dashboard']);
  }
}
