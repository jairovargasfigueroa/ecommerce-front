import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';

import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  standalone : true,
  selector: 'app-catalogo',
  imports: [CommonModule,
            MaterialModule,
            RouterModule,
            MatPaginatorModule,
            MatCardModule,
            MatButtonModule
          ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;
  panelAbierto = false;
  carrito: any[] = [];

  productos: any[] = []; // Lista completa de productos
  pageSize = 10; // Número de productos por página
  paginaActual = 0; // Página actual
  totalProductos = 0; // Total de productos

  
  constructor(private apiService: ApiService,
              private carritoService :CarritoService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.carrito = this.carritoService.obtenerCarrito(); // Obtener el carrito del servicio
  }

  

  getProducts(): void {

    this.apiService.get<any>('productos/',{ page: this.paginaActual + 1 }).subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data);
        this.productos = data.results;
        this.totalProductos = data.count;
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }


  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.paginaActual = event.pageIndex;
    this.getProducts();
  }

  addToCart(producto: any): void {
  this.carritoService.agregarProducto(producto); // Agregar el producto al carrito
  this.carrito = this.carritoService.obtenerCarrito();

  this.drawer.open(); // Abrir el panel lateral
  
    console.log('Producto agregado al carrito:', producto);
    console.log('Carrito actual:', this.carrito);
  }

  quitarProducto(producto: any): void {
    this.carritoService.quitarProducto(producto); // Quitar el producto del carrito
    this.carrito = this.carritoService.obtenerCarrito(); // Actualizar el carrito desde el servicio
    console.log('Producto quitado del carrito:', producto);
    console.log('Carrito actualizado:', this.carrito);
  }  

  vaciarCarrito():void{
    this.carritoService.vaciarCarrito();
    this.carrito = this.carritoService.obtenerCarrito();
    console.log('Carrito Vacio',this.carrito);
  }

}
