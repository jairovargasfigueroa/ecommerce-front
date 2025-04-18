import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogoCrearEditarComponent } from './dialogo-crear-editar/dialogo-crear-editar.component';

import { ApiService } from 'src/app/services/api.service';
import { DialogoEliminarComponent } from './dialogo-eliminar/dialogo-eliminar.component';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-categorias',
  imports: [    
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit{
  dataSource1 = new MatTableDataSource<Categoria>([]);
  columnas: string[] = ['nombre', 'descripcion', 'acciones'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.apiService.get<Categoria[]>('categorias').subscribe({
      next: (data) => {
        this.dataSource1.data = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  guardar(): void {
    const dialogRef = this.dialog.open(DialogoCrearEditarComponent, {
      width: '500px',
      data: null
    });
  
    dialogRef.afterClosed().subscribe((result: Categoria) => {
      console.log('Resultado del diálogo:', result);  // <-- esto
      if (result) {
        this.apiService.post<Categoria>('categorias/', result).subscribe({
          next: (nuevaCategoria) => {
            this.dataSource1.data = [...this.dataSource1.data, nuevaCategoria];
          }
        });
      }
    });
  }
  

  editar(categoria: Categoria): void {
    const dialogRef = this.dialog.open(DialogoCrearEditarComponent, {
      width: '500px',
      data: { ...categoria }
    });
  
    dialogRef.afterClosed().subscribe((result: Categoria) => {
      if (result) {
        this.apiService.put<Categoria>('categorias', result.id, result).subscribe({
          next: (updated) => {
            const index = this.dataSource1.data.findIndex(c => c.id === updated.id);
            if (index !== -1) {
              this.dataSource1.data[index] = updated;
              this.dataSource1.data = [...this.dataSource1.data];
            }
          }
        });
      }
    });
  }

  eliminar(categoria: Categoria): void {
    const dialogRef = this.dialog.open(DialogoEliminarComponent, {
      width: '350px',
      maxHeight: '90vh',
      data: {nombre: categoria.nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.delete('categorias', categoria.id).subscribe({
          next: () => {
            this.dataSource1.data = this.dataSource1.data.filter(c => c.id != categoria.id)
          },
          error: (e) => {
            console.log('Error eliminando categoría: ', e);
          }
        });
      }
    });
  }

}
