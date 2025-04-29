import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
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
    MatInputModule,
    MaterialModule

  ],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  recomendaciones: any[] = [];
  total = 0;

  constructor(private carritoService: CarritoService,
              private api: ApiService,
              private router : Router) {}

  ngOnInit(): void {
    const carritoActual = localStorage.getItem('carrito');
    this.carrito = carritoActual ? JSON.parse(carritoActual) : [];

    this.actualizarTotal();
    this.obtenerRecomendaciones();
  }
  
  agregarProducto(producto: any): void {
    this.carritoService.agregarProducto(producto); // Agregar el producto al carrito
    this.carrito = this.carritoService.obtenerCarrito();
    this.actualizarTotal();
    console.log('Producto agregado al carrito:', producto);
    console.log('Carrito actual:', this.carrito);
  }
  
  quitarProducto(producto: any): void {
    this.carritoService.quitarProducto(producto); // Quitar el producto del carrito
    this.carrito = this.carritoService.obtenerCarrito(); // Actualizar el carrito desde el servicio
    console.log('Producto quitado del carrito:', producto);
    console.log('Carrito actualizado:', this.carrito);
    this.actualizarTotal();
  }  

  eliminarProducto(producto: any): void {
    this.carritoService.eliminarProducto(producto);
    this.carrito = this.carritoService.obtenerCarrito();
    this.actualizarTotal();
  }
  

  vaciarCarrito():void{
    this.carritoService.vaciarCarrito();
    this.carrito = this.carritoService.obtenerCarrito();
    console.log('Carrito Vacio',this.carrito);
    this.actualizarTotal();
  }

  actualizarTotal(): void {
    this.total = this.carrito.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
  }
  

  irAPagar(): void {
    const token = localStorage.getItem('token');
  
    if (!token) {
      localStorage.setItem('redireccionPendiente', '/confirmar-pedido');
      this.router.navigate(['/authentication/login']);
      return;
    }

    this.crearPedidoPendiente();
  
    
  }

  crearPedidoPendiente(){
    // Preparar los ítems del carrito como se espera en el backend
    const items = this.carrito.map(item => ({
      producto: item.id,  // ID del producto
      // producto_nombre: item.nombre, // Nombre del producto
      cantidad: item.cantidad,
      precio_unitario: item.precio  // El backend lo usará para calcular total
    }));

    const DatosPedido = {
      items :items,
      estado : "pendiente",
      tipo_pago : "efectivo",
      tipo_entrega:"tienda"
    }

    console.log('Carritodelpedido',this.carrito)

    console.log('DatosDelPedido',DatosPedido)
    this.carritoService.vaciarCarrito();
    this.api.post<any>('pedidos/', DatosPedido).subscribe({
      next: (res: any) => {
        console.log('Pedido creado con éxito:', res);
  
        this.router.navigate(['/confirmar-pedido']);
      },
      error: (err) => {
        console.error('Error al crear el pedido pendiente', err);
      }
    });

  }

  obtenerRecomendaciones(): void {
    const nombresProductos = this.carrito.map(p => p.nombre);
  
    if (nombresProductos.length === 0) {
      this.recomendaciones = [];
      return;
    }
  
    this.api.post('recomendaciones/', { productos: nombresProductos }).subscribe({
      next: (data:any) => {
        this.recomendaciones = data.recomendaciones;
        console.log('📢 Productos recomendados:', this.recomendaciones);
      },
      error: (err) => {
        console.error('Error al obtener recomendaciones', err);
      }
    });
  }
  
  

  




}
