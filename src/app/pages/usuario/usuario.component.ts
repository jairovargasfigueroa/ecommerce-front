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


  columnas : String[]= ['username','email','rol']; 
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios():void{
    this.apiService.get<any>('usuarios/').subscribe({
      next:(data) => {
        console.log('usuarios obtenidos:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },error:(error) => console.log('Error al obtener usuarios',error)
      
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
