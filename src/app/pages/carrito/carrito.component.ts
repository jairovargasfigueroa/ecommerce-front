import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  standalone: true,
  selector: 'app-carrito',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule

  ],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  total = 0;

  constructor(private cartService: CarritoService,
             private api: ApiService) {}

  ngOnInit(): void {
    const carritoActual = localStorage.getItem('carrito');
    this.carrito = carritoActual ? JSON.parse(carritoActual) : [];

    this.total = this.carrito.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
  }
  
  eliminarProducto(productoId: number): void {
    // Eliminar el producto del carrito
    this.carrito = this.carrito.filter((p) => p.id !== productoId);

    // Actualizar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    // Recalcular el total
    this.total = this.carrito.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
  }


}
