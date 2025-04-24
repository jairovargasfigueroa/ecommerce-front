import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-pedido-detalles',
  imports: [CommonModule,MaterialModule],
  templateUrl: './pedido-detalles.component.html',
  styleUrl: './pedido-detalles.component.scss'
})
export class PedidoDetallesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PedidoDetallesComponent>
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
