import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';
import { PedidoDetallesComponent } from './pedido-detalles/pedido-detalles.component';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule,MaterialModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalRegistros = 0;
  paginaActual = 1;

  columnas: string[] = [
     'id','estado','monto_total','fecha_pedido','acciones'
  ];

  dataSource = new MatTableDataSource<any>();
  
  ngOnInit(): void {
    //this.obtenerPedidos();
  }

  ngAfterViewInit() {
    this.obtenerPedidos(); // cargar página inicial
    this.paginator.page.subscribe(() => this.obtenerPedidos());
  }

  

  constructor(private apiService : ApiService,
              private dialog : MatDialog
  ) {}

  

  obtenerPedidos() {
    const pagina = this.paginator.pageIndex + 1;
    const page_size = this.paginator.pageSize;
    this.apiService.get<any>('pedidos/',{page:pagina,page_size:page_size}).subscribe({
      next:(data) =>{

        this.dataSource.data = data.results;
        this.totalRegistros = data.count;
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Productos obtenidos:', data);
      },
      error(err) {
          console.error('Error al obtener pedidos',err)
      },

    })
  }

  verDetallePedido(pedido: any): void {
    this.dialog.open(PedidoDetallesComponent ,{
      data: pedido,
      width: '500px',
      maxHeight: '90vh'
    });
  }

  


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
