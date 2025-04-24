import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router,private apiService: ApiService) {}

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    rol: new FormControl('cliente') // default para registro
    
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    console.log('DatosForm',this.form.value);
    this.apiService.post('usuarios/',this.form.value).subscribe({
      next:() =>{
        const redir = localStorage.getItem('redireccionPendiente');
        if(redir){
          this.router.navigate(['/authentication/login']);
        }else{
          this.router.navigate(['/dashboard'])
        }
      },error:(err) => {
        console.error('Error al registar usuario',err)
      }
    })
  }
}
