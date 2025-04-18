import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-eliminar',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialogo-eliminar.component.html',
  styleUrl: './dialogo-eliminar.component.scss'
})
export class DialogoEliminarComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {nombre: string}
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
