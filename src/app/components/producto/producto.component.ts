import { Component,OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
//import { CarritoService } from '../../services/carrito.service';

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

  ngOnInit(){
    this.productos = this.productoService.obtenerProductos();
  }

  agregarAlCarrito(producto:any){
    this.carritoService.agregarProducto(producto);

  }
  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }

}
