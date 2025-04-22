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

  grabando = false;
  textoReconocido = ''; // texto que devuelva el backend
  private grabador!: MediaRecorder;
  private fragmentosAudio: Blob[] = [];

  
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

  interpretarTexto(texto: string): void {
    this.apiService.post<any>('asistente/', { texto }).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        if (!respuesta || !respuesta.tipo || !respuesta.productos) return;
  
        respuesta.productos.forEach((item: any) => {
          const producto = this.productos.find(p =>
            p.nombre.toLowerCase().includes(item.nombre.toLowerCase())
          );
  
          if (!producto) return;
  
          const cantidad = item.cantidad;
  
          for (let i = 0; i < cantidad; i++) {
            if (respuesta.tipo === 'agregar') {
              this.addToCart(producto);
            } else if (respuesta.tipo === 'eliminar') {
              this.quitarProducto(producto);
            }
          }
        });
      },
      error: (err) => console.error('Error del asistente de voz', err)
    });
  }
  
  iniciarGrabacion(): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(flujo => {
      this.fragmentosAudio = [];
      this.grabador = new MediaRecorder(flujo);

      this.grabador.ondataavailable = (evento) => {
        this.fragmentosAudio.push(evento.data);
      };

      this.grabador.onstop = () => {
        const audioBlob = new Blob(this.fragmentosAudio, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'grabacion.webm');

        this.apiService.postFile('asistente/voz/', formData).subscribe({
          next: (respuesta: any) => {
            this.textoReconocido = respuesta.texto;
            console.log('🗣 Texto reconocido:', this.textoReconocido);
            this.interpretarTexto(this.textoReconocido);
          },
          error: (err) => console.error('❌ Error al enviar audio:', err)
        });
      };

      this.grabador.start();
      this.grabando = true;
      console.log('🎙 Grabando...');
    }).catch(error => {
      console.error('❌ No se pudo acceder al micrófono:', error);
    });
  }

  detenerGrabacion(): void {
    if (this.grabador && this.grabador.state !== 'inactive') {
      this.grabador.stop();
      this.grabando = false;
    }
  }
}
