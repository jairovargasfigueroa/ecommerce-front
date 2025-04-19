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
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });



  login(){
    if (this.form.invalid) {
      console.log;("Formulario inválido");
      return;
    }

    const body = {
      username : this.form.value.uname,
      password : this.form.value.password
    };

    const datos = this.form.value;
    console.log(datos);

    this.apiService.post<any>("usuarios/login/",body).subscribe({
      next: (data:any) =>{
        console.log(data);
        
        localStorage.setItem('token', data.access);
        localStorage.setItem('usuario', data.username);
        localStorage.setItem('rol', data.rol);
        this.router.navigate(['/dashboard']);
      },
       error: (error:any) =>{
        console.log(error,"Error credenciale incorrectas");
        alert('Credenciales incorrectas');
      }
    });
    console.log("se llamo al api correctamente");
  
  }
}
