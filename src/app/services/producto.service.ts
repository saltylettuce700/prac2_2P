import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import { CarritoService } from './carrito.service';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  /*constructor(
    private carritoService : CarritoService,
    private router : Router
  ) { }*/
  

  private productos : Producto[] = [
    new Producto(1,"Laptop",1200,"/assets/laptop.jpg"),
    new Producto(2,"Celular",800,"/assets/celular.jpg"),
    new Producto(3,"Tablet",600,"/assets/tablet.jpg")

  ];

  obtenerProductos():Producto[]{
    return this.productos;
  }

  

  
}


