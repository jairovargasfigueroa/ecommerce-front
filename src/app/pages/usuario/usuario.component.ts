import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone : true,
  selector: 'app-usuario',
  imports: [CommonModule,MaterialModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit{

  totalRegistros = 0;
  paginaActual = 1;


  columnas : String[]= ['username','email','rol']; 
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    const pagina = this.paginator?.pageIndex ?? 0;
    this.apiService.get<any>('usuarios/',{page:pagina +1}).subscribe({
      next:(data) => {
        console.log('usuarios obtenidos:', data);
        this.dataSource.data = data.results;
        this.totalRegistros = data.count;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },error:(error) => console.log('Error al obtener usuarios',error)
      
    });

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.obtenerUsuarios());
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
