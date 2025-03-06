import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
  standalone: true
})
export class CarritoComponent {
  carrito : any []=[];
  constructor(private carritoService : CarritoService){};

  ngOnInit(){
    this.carrito=this.carritoService.obtenerCarrito();

  }

  eliminarProducto(index: number) { //Elimina y Actualiza la lista en tiempo real
    this.carrito.splice(index, 1);
    
  }

  agregarProducto(producto: Producto) {
    this.carritoService.agregarProducto(producto); // añade otro producto igual al del carrito
  }

  generarXML(){
    this.carritoService.generarXML();
  }
}
