import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';

import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { VoiceCommandService } from 'src/app/services/voice-command.service';

@Component({
  standalone : true,
  selector: 'app-catalogo',
  imports: [CommonModule,
            MaterialModule,
            RouterModule,
            MatPaginatorModule,
            MatCardModule,
            MatButtonModule,
            FormsModule
          ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  panelAbierto = false;
  carrito: any[] = [];


  productos: any[] = []; // Lista completa de productos
  pageSize = 10; // Número de productos por página
  paginaActual = 0; // Página actual
  totalProductos = 0; // Total de productos

  productosAFiltrar: any[] = [];  // Aquí guardamos todos los productos sin filtrar
  filtroTexto: string = '';


  
  constructor(private apiService: ApiService,
              private carritoService :CarritoService,
              private voiceService: VoiceCommandService,
              private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.obtenerProductosDelCatalogo();
    //this.carrito = this.carritoService.obtenerCarrito(); // Obtener el carrito del servicio
    
    this.carrito = [...this.carritoService.obtenerCarrito()];

  }

  
  ngAfterViewInit() {
    this.obtenerProductosDelCatalogo(); // cargar página inicial
    this.paginator.page.subscribe(() => this.obtenerProductosDelCatalogo());
  }

  filtrarProductos(): void {
    const texto = this.filtroTexto.toLowerCase().trim();
    if (texto === '') {
      this.productosAFiltrar = [...this.productos];
    } else {
      this.productos = this.productosAFiltrar.filter(prod =>
        prod.nombre.toLowerCase().includes(texto) ||
        prod.descripcion.toLowerCase().includes(texto) ||
        (prod.categoria && prod.categoria.toLowerCase().includes(texto))
      );
    }
  }
  

  
  

  obtenerProductosDelCatalogo(): void {
    const pagina = this.paginator.pageIndex + 1;
    const page_size = this.paginator.pageSize;
    this.apiService.get<any>('productos/',{page:pagina,page_size:page_size}).subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data);
        this.productos = data.results;
        this.productosAFiltrar = [...this.productos]; // Guardar la lista original de productos
        this.totalProductos = data.count;
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }


  agregarProducto(producto: any): void {
  this.carritoService.agregarProducto(producto); // Agregar el producto al carrito
  //this.carrito = this.carritoService.obtenerCarrito();
  this.carrito = [...this.carritoService.obtenerCarrito()];

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

  eliminarProducto(producto: any): void {
    this.carritoService.eliminarProducto(producto);
    this.carrito = this.carritoService.obtenerCarrito();
  }

  vaciarCarrito():void{
    this.carritoService.vaciarCarrito();
    this.carrito = this.carritoService.obtenerCarrito();
    console.log('Carrito Vacio',this.carrito);
  }

  activarComandoVoz(): void {
    this.voiceService.startListening((comando) => {
      this.zone.run(() => {   // 🔥 Aseguramos que Angular detecte el cambio
        console.log('Comando detectado:', comando);
        this.interpretarComando(comando);
      });
    });
  }
  
  // interpretarComando(comando: string): void {
  //   if (comando.includes('agregar')) {
  //     const nombreProducto = comando.replace('agregar', '').trim();
  //     console.log('Producto que se agregara mediante voz:', nombreProducto);
  //     const productoEncontrado = this.productos.find(p => 
  //       p.nombre.toLowerCase().includes(nombreProducto)
  //     );
  
  //     if (productoEncontrado) {
  //       this.agregarProducto(productoEncontrado);
  //       // this.carrito = [...this.carritoService.obtenerCarrito()];

  //       console.log(`✅ Producto "${productoEncontrado.nombre}" agregado por voz.`);
  //     } else {
  //       console.warn(`Producto "${nombreProducto}" no encontrado.`);
  //     }
  //   } else {
  //     console.warn('Comando no reconocido.');
  //   }
  // }

  interpretarComando(comando: string): void {
    if (comando.includes('agregar')) {
      this.procesarAgregarPorVoz(comando);
    } else if (comando.includes('quitar')) {
      this.procesarQuitarPorVoz(comando);
    } else if (comando.includes('eliminar')) {
      this.procesarEliminarPorVoz(comando);
    } else if (comando.includes('vaciar carrito')) {
      this.procesarVaciarCarritoPorVoz();
    } else {
      console.warn('⚠️ Comando no reconocido.');
    }
  }
  
  private procesarAgregarPorVoz(comando: string): void {
    const { cantidad, nombreProducto } = this.detectarCantidad(comando, 'agregar');
  
    const productoEncontrado = this.productos.find(p => 
      p.nombre.toLowerCase().includes(nombreProducto)
    );
  
    if (productoEncontrado) {
      for (let i = 0; i < cantidad; i++) {
        this.agregarProducto(productoEncontrado);
      }
      console.log(`✅ Agregado ${cantidad}x "${productoEncontrado.nombre}" al carrito.`);
    } else {
      console.warn(`❌ Producto "${nombreProducto}" no encontrado.`);
    }
  }
  
  private procesarQuitarPorVoz(comando: string): void {
    const { cantidad, nombreProducto } = this.detectarCantidad(comando, 'quitar');
  
    const productoEncontrado = this.productos.find(p => 
      p.nombre.toLowerCase().includes(nombreProducto)
    );
  
    if (productoEncontrado) {
      for (let i = 0; i < cantidad; i++) {
        this.quitarProducto(productoEncontrado);
      }
      console.log(`➖ Quitado ${cantidad}x "${productoEncontrado.nombre}" del carrito.`);
    } else {
      console.warn(`❌ Producto "${nombreProducto}" no encontrado.`);
    }
  }
  

  private procesarEliminarPorVoz(comando: string): void {
    const nombreProducto = comando.replace('eliminar', '').trim();
  
    const productoEncontrado = this.productos.find(p => 
      p.nombre.toLowerCase().includes(nombreProducto)
    );
  
    if (productoEncontrado) {
      this.eliminarProducto(productoEncontrado);
      console.log(`🗑️ Producto "${productoEncontrado.nombre}" eliminado completamente del carrito.`);
    } else {
      console.warn(`❌ Producto "${nombreProducto}" no encontrado para eliminar.`);
    }
  }
  
  private procesarVaciarCarritoPorVoz(): void {
    this.carritoService.vaciarCarrito();
    this.carrito = this.carritoService.obtenerCarrito();
    this.drawer.close(); // Cerrar el panel lateral
    console.log('🧹 Carrito vaciado por comando de voz.');
  }

  private detectarCantidad(comando: string, palabraClave: string): { cantidad: number, nombreProducto: string } {
    const texto = comando.replace(palabraClave, '').trim();
    
    // Detectar si el primer número que aparece es la cantidad
    const match = texto.match(/^(\d+)\s+(.+)/);
  
    if (match) {
      const cantidad = parseInt(match[1], 10);
      const nombreProducto = match[2].trim();
      return { cantidad, nombreProducto };
    }
  
    // Si no hay número explícito, asumimos 1
    return { cantidad: 1, nombreProducto: texto };
  }
  
  


  

}
