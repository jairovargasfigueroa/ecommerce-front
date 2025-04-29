import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/app/material.module';

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
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.scss']
})
export class ProductoDialogComponent implements OnInit {

  
  form !: FormGroup;
  isEditMode =false;
  previewUrl: string | ArrayBuffer | null = null;

  categorias = [
    { value: 'telefonos', label: 'Teléfonos y Smartphones' },
    { value: 'laptops', label: 'Laptops y Notebooks' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'acc_movil', label: 'Accesorios para Móviles' },
    { value: 'acc_pc', label: 'Accesorios para Computadoras' },
    { value: 'auriculares', label: 'Auriculares y Audífonos' },
    { value: 'camaras', label: 'Cámaras y Fotografía' },
    { value: 'wearables', label: 'Smartwatches y Wearables' },
    { value: 'consolas', label: 'Consolas y Videojuegos' },
    { value: 'tv', label: 'Televisores y Pantallas' },
    { value: 'audio', label: 'Audio y Sonido' },
    { value: 'drones', label: 'Drones' },
    { value: 'almacenamiento', label: 'Almacenamiento' },
    { value: 'impresoras', label: 'Impresoras y Escáneres' },
    { value: 'redes', label: 'Routers y Redes' },
    { value: 'componentes', label: 'Componentes de PC' },
    { value: 'electro_inteligente', label: 'Electrodomésticos Inteligentes' },
    { value: 'monitores', label: 'Monitores' },
    { value: 'proyectores', label: 'Proyectores' },
    { value: 'cargadores', label: 'Cargadores y Baterías' },
    { value: 'perifericos', label: 'Periféricos' },
    { value: 'hogar_smart', label: 'Hogar Inteligente' },
    { value: 'powerbank', label: 'Power Banks' },
    { value: 'software', label: 'Software y Licencias' },
    { value: 'cables', label: 'Cables y Adaptadores' },
  ];
  
  

  constructor(private fb: FormBuilder,
              private dialogRef:MatDialogRef<ProductoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
            ) {}


  ngOnInit(): void {
    this.isEditMode = !! this.data;

    this.form = this.fb.group({
      nombre: [this.data ?.nombre || '', Validators.required],
      descripcion: [this.data ?.descripcion || '', Validators.required],
      precio: [this.data ?.precio || '', Validators.required],
      stock: [this.data ?.stock || '', Validators.required],
      categoria: [this.data ?.categoria || '', Validators.required],
      //fecha_creacion: [this.data ?.fecha_creacion || '', Validators.required],
      imagen: [this.data ?.imagen || ''],
    });

     // Si estamos editando y hay imagen, la mostramos
    if (this.isEditMode && this.data.imagen) {
      this.previewUrl = this.data.imagen;  // Suponiendo que ya es una URL válida desde el backend
    }






  }

  
  filtroCategoria: string = '';
  categoriasFiltradas() {
    if (!this.filtroCategoria) {
      return this.categorias;
    }
    return this.categorias.filter(cat =>
      cat.label.toLowerCase().includes(this.filtroCategoria.toLowerCase())
    );
  }


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
 
