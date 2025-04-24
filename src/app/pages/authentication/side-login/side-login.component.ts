import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router,
              private apiService : ApiService
  ) {}

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });



  login(){
    if (this.form.invalid) {
      console.log;("Formulario inválido");
      return;
    }

    const datos = this.form.value;
    console.log(datos);

    this.apiService.post<any>("usuarios/login/",datos).subscribe({
      next: (data:any) =>{
        console.log('UsuarioLogueado',data);
        
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('rol', data.rol);
        
        const redir = localStorage.getItem('redireccionPendiente');

        if(redir){
          //localStorage.removeItem('redireccionPendiente');
          this.router.navigate([redir]);
        }else{
          this.router.navigate(['/dashboard']);
        }
      },
       error: (error:any) =>{
        console.log(error,"Error credenciale incorrectas");
        alert('Credenciales incorrectas');
      }
    });
    console.log("se llamo al api correctamente");
  
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    localStorage.removeItem('redireccionPendiente');
    localStorage.removeItem('carrito'); // opcional
  
    // Redirigís al usuario al catálogo o login
    this.router.navigate(['/catalogo']);
  }

}
