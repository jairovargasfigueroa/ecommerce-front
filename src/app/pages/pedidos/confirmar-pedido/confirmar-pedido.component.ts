import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-confirmar-pedido',
  imports: [CommonModule,MaterialModule],
  templateUrl: './confirmar-pedido.component.html',
  styleUrl: './confirmar-pedido.component.scss'
})
export class ConfirmarPedidoComponent implements OnInit{

  stripePromise = loadStripe('pk_test_51RGa3uR60AvZBvnPKgJB1xPYOmSy4Ak06GkLjl7aE2o09qjZQxudy1im32X1hyfIQLRyVZ7qd5AJIOE0SuNy6Q9J00dGAHACgC');  // Usa tu clave pública de Stripe
  
  pedido: any = null;
  cargando = true;
  tipoEntrega: string = 'tienda';
  metodoPago: string = 'efectivo';



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['pago'] === 'exitoso') {
        this.snackBar.open('✅ Pago realizado con éxito', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-success']
        });
      } else if (params['pago'] === 'fallido') {
        this.snackBar.open('⚠️ El pago fue cancelado o fallido', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
  
      // Limpiar el query param después de mostrar el mensaje (opcional)
      if (params['pago']) {
        this.router.navigate([], { queryParams: {} });
      }
  
      // Mantener tu lógica actual:
      const redireccion = localStorage.getItem('redireccionPendiente');
      if (redireccion === '/confirmar-pedido') {
        this.crearPedidoDesdeCarrito();
        localStorage.removeItem('redireccionPendiente');
      } else {
        this.obtenerPedidoPendienteActual();
      }
    });
  }
  

  constructor(private api: ApiService,
              private carritoService: CarritoService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar
              
  ) {}

  pagarConTarjeta(): void {
    if (!this.pedido) return;

    console.log('Entro a pago con tarejta')
    this.api.post<any>('pagos/crear-sesion-pago/', { pedido_id: this.pedido.id }).subscribe({
      next: async (response) => {
        const stripe = await this.stripePromise;
        console.log('Sessionid de strype',response)
        if (stripe) {
          const resultado = await stripe.redirectToCheckout({ sessionId: response.sessionId });
          if (resultado.error) {
            console.error('Error al redirigir a Stripe:', resultado.error.message);
          }
        }
      },
      error: (err) => console.error('Error al crear sesión de pago:', err)
    });
  }
  

  crearPedidoDesdeCarrito():void {
    const carrito = this.carritoService.obtenerCarrito();

    const items = carrito.map(item => ({
      producto: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));

    const pedidoData = {
      items: items,
      estado: 'pendiente',
      tipo_pago: this.metodoPago,      // Nuevo
      tipo_entrega: this.tipoEntrega  // Nuevo
    };

    console.log('Carritodelpedido',carrito)

    console.log('DatosDelPedido',pedidoData)

    this.carritoService.vaciarCarrito();
    this.api.post<any>('pedidos/', pedidoData).subscribe({
      next: (res: any) => {
        console.log('Pedido creado desde carrito:', res);
        this.obtenerPedidoPendienteActual(); // Ya creado, ahora lo cargamos
      },
      error: (err) => {
        console.error('Error al crear pedido desde carrito:', err);
      }
    });
  }

  obtenerPedidoPendienteActual(): void {
    this.api.get<any>('pedidos/pendiente-actual/').subscribe({
      next: (res) => {
        this.pedido = res;
        this.cargando = false;
        console.log('Pedido pendiente:', res);
      },
      error: (err) => {
        this.cargando = false;
        console.error('No hay pedido pendiente o ocurrió un error:', err);
      }
    });
  }

  finalizarPedido(): void {
    if (!this.pedido || !this.pedido.id) return;
    console.log('Finalizo pedido')

    console.log(`Entrega: ${this.tipoEntrega} | Pago: ${this.metodoPago}`);
  
    this.api.patch('pedidos', this.pedido.id, {
      tipo_entrega: this.tipoEntrega,
      tipo_pago: this.metodoPago,
      estado: 'completado'  // O el estado que decidas
    }).subscribe({
      next: (res) => {
        console.log('Pedido finalizado:', res);
        console.log('Pedido actualizado:', res);
        this.snackBar.open('Pedido confirmado con éxito', 'Cerrar', { duration: 3000 });
        
        this.carritoService.vaciarCarrito();

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al finalizar el pedido:', err);
      }
    });
  }
  

}
