import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-producto-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.scss']
})
export class ProductoDialogComponent implements OnInit {

  
  form !: FormGroup;
  isEditMode =false;
  previewUrl: string | ArrayBuffer | null = null;


  constructor(private fb: FormBuilder,
              private dialogRef:MatDialogRef<ProductoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any
            ) {}


  ngOnInit(): void {
    this.isEditMode = !! this.data;

    this.form = this.fb.group({
      nombre: [this.data ?.nombre || '', Validators.required],
      descripcion: [this.data ?.descripcion || '', Validators.required],
      precio: [this.data ?.precio || '', Validators.required],
      stock: [this.data ?.stock || '', Validators.required],
      //fecha_creacion: [this.data ?.fecha_creacion || '', Validators.required],
      imagen: [this.data ?.imagen || ''],
    });

     // Si estamos editando y hay imagen, la mostramos
    if (this.isEditMode && this.data.imagen) {
      this.previewUrl = this.data.imagen;  // Suponiendo que ya es una URL válida desde el backend
    }

  }

  // onSubmit():void{
  //   if(this.form.valid){
  //     const formData = new FormData();

  //     for (const key in this.form.value) {
        
  //        formData.append(key, this.form.value[key]);
      
  //     }


  //     this.dialogRef.close(formData)
  //   }
  // }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
  
      for (const key in this.form.value) {
        if (key === 'imagen') {
          const imagenValue = this.form.value[key];
          // Solo enviamos si es un archivo (o sea, si el usuario subió una nueva imagen)
          if (imagenValue instanceof File) {
            formData.append('imagen', imagenValue);
          }
        } else {
          formData.append(key, this.form.value[key]);
        }
      }
  
      if (this.isEditMode) {
        formData.append('id', this.data.id);
      }
  
      this.dialogRef.close(formData);
    }
  }
  
  onCancel():void{
    this.dialogRef.close();
  }

  isCreateMode(): boolean {
    return !this.isEditMode;
  }

  isUpdateMode(): boolean {
    return this.isEditMode;
  }

  cargarImagen(arg0: any) {
    console.log(arg0);
    const input = arg0.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    console.log('file',file);
    // const blob = new Blob([file], { type: file.type });
    this.form.get('imagen')?.setValue(file);

    // Mostrar la previsualización
    const reader = new FileReader();
    reader.onload = () => {
    this.previewUrl = reader.result;
    };
  reader.readAsDataURL(file);
  }

}
 
