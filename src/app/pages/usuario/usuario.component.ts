import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

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


  columnas : String[]= ['username','email','rol','acciones']; 
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService,
              private dialog: MatDialog,
              // private router: Router
  ){}

  ngOnInit(): void {
    //this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    const pagina = this.paginator.pageIndex + 1;
    const page_size = this.paginator.pageSize;
    this.apiService.get<any>('usuarios/',{page:pagina,page_size:page_size}).subscribe({
      next:(data) => {
        console.log('usuarios obtenidos:', data);
        this.dataSource.data = data.results;
        this.totalRegistros = data.count;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        
      },error:(error) => console.log('Error al obtener usuarios',error)
      
    });

  }

  registrarUsuario(): void {
      const dialogRef = this.dialog.open(UsuarioDialogComponent,{
        width: '1000px'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Usuario a registrar:', result);
          this.apiService.post('usuarios/', result).subscribe(() => this.obtenerUsuarios());
        }
      });
    }
  
    editarUsuario(usuario: any): void {
      const dialogRef = this.dialog.open(UsuarioDialogComponent, {
        width: '1000px',
        data: usuario
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Usuario a editadar:', result);
          this.apiService.put('usuarios', usuario.id, result).subscribe(() => this.obtenerUsuarios());
        }
      });
    }
  
    eliminarUsuario(id: number): void {
      this.apiService.delete('usuarios', id).subscribe(() => this.obtenerUsuarios());
    }

  ngAfterViewInit() {
    this.obtenerUsuarios(); // cargar página inicial
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
