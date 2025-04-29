import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-usuario-dialog',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.scss'
})
export class UsuarioDialogComponent implements OnInit{

  form !: FormGroup;
  isEditMode =false;
  
  constructor(private fb: FormBuilder,
              private dialogRef:MatDialogRef<UsuarioDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any
            ) {}


  ngOnInit(): void {
    this.isEditMode = !! this.data;
    this.form = this.fb.group({
      username: [this.data ?.username || '', Validators.required],
      password: [this.data ?.password || ''],
      email: [this.data ?.email || ''],
      rol: [this.data ?.rol || '', Validators.required],
      // fecha_creacion: [this.data ?.fecha_creacion || '', Validators.required],
    });

  }

  onSubmit(): void {
    if (this.form.valid) {
      // const formData = new FormData();
  
      
      const formData = this.form.value;
      console.log('formData',formData);
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

}
