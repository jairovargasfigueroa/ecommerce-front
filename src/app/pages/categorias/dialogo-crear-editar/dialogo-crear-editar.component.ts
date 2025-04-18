import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-dialogo-crear-editar',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dialogo-crear-editar.component.html',
  styleUrl: './dialogo-crear-editar.component.scss'
})
export class DialogoCrearEditarComponent implements OnInit{
  categoriaForm!: FormGroup;
  modo: 'crear' | 'editar' = 'crear';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogoCrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria | null
  ) {}

  ngOnInit(): void {
    this.modo = this.data ? 'editar' : 'crear';

    this.categoriaForm = this.fb.group({
      nombre: [this.data?.nombre || '', Validators.required],
      descripcion: [this.data?.descripcion || '', Validators.required]
    });
  }

  guardar(): void {
    if (this.categoriaForm.valid) {
      const categoria: Categoria = {
        id: this.data?.id ?? undefined, // en modo "crear" esto puede ignorarse
        ...this.categoriaForm.value
      };
      this.dialogRef.close(categoria);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
