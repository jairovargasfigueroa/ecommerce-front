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

  rolUsuario : String | null = null;

  displayedColumns: string[] = [
     'imagen','nombre', 'descripcion', 'precio', 'stock', 'fecha_creacion','acciones'
  ];

  //dataSource: any[] =[];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private apiService : ApiService,
              private dialog : MatDialog,
              private router : Router
            
            ) {}


  ngOnInit(): void {
    this.getProductos();
    this.rolUsuario = localStorage.getItem('userRol');

    if (this.rolUsuario !== 'cliente') {
      // Podés redirigir a otra vista si no es admin
      this.router.navigate(['/dashboard']);
    }
  }

  getProductos() {
    this.apiService.get<any>('productos/').subscribe({
      next: (data) =>{ 
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Productos obtenidos:', data);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
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
        this.apiService.post('productos/', result).subscribe(() => this.getProductos());
      }
    });
  }

  editarProducto(producto: any): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      data: producto
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Producto editado:', result);
        const {id,... produtoEditado} =result;
        this.apiService.put('productos', producto.id, produtoEditado).subscribe(() => this.getProductos());
      }
    });
  }

  eliminarProducto(id: number): void {
    this.apiService.delete('productos', id).subscribe(() => this.getProductos());
  }


  esAdmin(): boolean {
    return this.rolUsuario ==='administrador'
  }

  esCliente(): boolean {
    return this.rolUsuario ==='cliente'
  }
  esDelivery(): boolean {
    return this.rolUsuario ==='delivery'
  }    

}
