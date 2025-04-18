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
      imagen: [this.data ?.imagen || '', Validators.required],
    });
  }

  onSubmit():void{
    if(this.form.valid){
      this.dialogRef.close(this.form.value)
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

}
 
