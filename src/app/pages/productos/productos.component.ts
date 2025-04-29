import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

// Angular Material (ya incluidos en tu plantilla)
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProductoDialogComponent } from './producto-dialog/producto-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-productos',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MaterialModule
],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  totalRegistros = 0;
  paginaActual = 1;

  displayedColumns: string[] = [
     'imagen','nombre', 'descripcion', 'precio', 'stock','categoria', 'fecha_creacion','acciones'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private apiService : ApiService,
              private dialog : MatDialog,
              private router : Router
            
            ) {}


  ngOnInit(): void {
    //this.obtenerProductos();
  }

  

  obtenerProductos() {
    const pagina = this.paginator.pageIndex + 1;
    const page_size = this.paginator.pageSize;
    this.apiService.get<any>('productos/',{page:pagina,page_size:page_size}).subscribe({
      next: (data) =>{ 
        this.dataSource.data = data.results;
        this.totalRegistros = data.count;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        console.log('Productos obtenidos:', data);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  ngAfterViewInit() {
    this.obtenerProductos(); // cargar página inicial
    this.paginator.page.subscribe(() => this.obtenerProductos());
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  crearProducto(): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.post('productos/', result,1).subscribe(() => this.obtenerProductos());
      }
    });
  }

  editarProducto(producto: any): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: '1000px',
      data: producto
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Producto a editadar:', result);
        const {id,... produtoEditado} =result;
        this.apiService.put('productos', producto.id, result,1).subscribe(() => this.obtenerProductos());
      }
    });
  }

  eliminarProducto(id: number): void {
    this.apiService.delete('productos', id).subscribe(() => this.obtenerProductos());
  }

}
