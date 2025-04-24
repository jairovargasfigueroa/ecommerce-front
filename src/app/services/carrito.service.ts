import { P } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito :any[]=[]; // Arreglo para almacenar los productos del carrito
    
// La clave para almacenar el carrito en localStorage

  constructor( ) {
    this.obtenerCarrito(); // Cargar el carrito desde localStorage al iniciar el servicio
  }


    // Métodos para manejar el carrito en localStorage

   obtenerCarrito(): any[] {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      console.log('carrito vacio')
      this.carrito = []; // Inicializar como vacío en caso de error
    }  

    return this.carrito

   }
   
   guardarCarrito():void{
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
   }

   agregarProducto(producto:any){

    const productoExistente = this.carrito.find((p) =>p.id === producto.id);
    if (productoExistente) { 
      productoExistente.cantidad += 1; // Incrementar la cantidad si ya existe
    }else{
      this.carrito.push({ ...producto, cantidad: 1 }); // Agregar el producto con cantidad inicial 1
    }
    this.guardarCarrito(); // Guardar el carrito actualizado en localStorage

   }

   quitarProducto(producto:any):void{
    const productoExistente = this.carrito.find((p) => p.id === producto.id);
    if(productoExistente.cantidad<=1){
     this.carrito = this.carrito.filter((p) => p.id !== producto.id); // Eliminar el producto del carrito
    }else {
      productoExistente.cantidad-=1; //Decrementa el producto
    }
    this.guardarCarrito(); // Guardar el carrito actualizado en localStorage
   }

  eliminarProducto(producto: any): void {
    this.carrito = this.carrito.filter((p) => p.id !== producto.id);
    this.guardarCarrito();
  } 

  vaciarCarrito():void{
    localStorage.removeItem('carrito');
    this.carrito= [];
  } 
  

}
