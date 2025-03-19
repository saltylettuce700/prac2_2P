import { Component,OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { InventarioService } from '../../services/inventario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  standalone : true
})


export class ProductoComponent implements OnInit {
  productos : any[] = [];
  
  constructor (
    private productoService : ProductoService,
    private carritoService : CarritoService,
    private router : Router

  ){}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  agregarAlCarrito(producto:any){
    this.carritoService.agregarProducto(producto);

  }
  
  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }
  
  irAlInventario(){
    this.router.navigate(['/inventario']);
  }

}
