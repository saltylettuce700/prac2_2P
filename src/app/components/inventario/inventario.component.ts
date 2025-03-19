import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { ProductoService } from '../../services/producto.service';


@Component({
  selector: 'app-inventario',
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true
})
export class InventarioComponent {
  inventario: any[] = []; //este arreglo inventario
  constructor(
    private inventarioService: InventarioService,
    private productoService : ProductoService
  ) { }

  ngOnInit(): void {
    this.inventarioService.obtenerInventario().subscribe({
      next: data => {
        this.inventario = []; // Limpiar antes de agregar productos
        data.forEach(producto => {
          this.inventario.push({
            id: Number(producto.id),
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            imagen: producto.imagen,
            cantidad: parseInt(producto.cantidad, 10),
            descripcion: producto.descripcion
          });
        });
      },
      error: error => {
        console.error('Error al obtener el inventario:', error.message);
      }
    });
  
  }

  

  // BOTONES PARA UN CRUD EN INVENTARIO

  agregarNuevoProducto() {
    const nuevoNombre = prompt('Nuevo nombre:') || '';  // Default to empty string if null
    const nuevoPrecio = prompt('Nuevo precio:') || '';  // Default to empty string if null
    const nuevaImagen = prompt('Nueva imagen (URL):') || '';  // Default to empty string if null
    const nuevaDescripcion = prompt('Nueva descripción:') || '';  // Default to empty string if null
    const nuevaCantidad = prompt('Nueva cantidad:') || '';  // Default to empty string if null
    
    // Convert precio and cantidad to numbers
    const precioNumerico = parseFloat(nuevoPrecio); // Convert to number, NaN if invalid
    const cantidadNumerica = parseInt(nuevaCantidad, 10); // Convert to number, NaN if invalid
  
    // Handle invalid number values (NaN)
    if (isNaN(precioNumerico) || isNaN(cantidadNumerica)) {
      alert('Por favor ingrese valores válidos para precio y cantidad');
      return;  // Exit the method if there is an invalid number
    }
  
    const nuevoProducto: Producto = {
      id: this.inventario.length + 1,
      nombre: nuevoNombre,  // Default to empty string if prompt returns null
      precio: precioNumerico,  // Assign the converted price
      imagen: nuevaImagen,  // Default to empty string if prompt returns null
      descripcion: nuevaDescripcion,  // Default to empty string if prompt returns null
      cantidad: cantidadNumerica  // Assign the converted quantity
    };
  
    this.inventario.push(nuevoProducto);
  }
  
  

  editarProducto(producto: Producto) {
    const nuevoNombre = prompt('Nuevo nombre:', producto.nombre);
    const nuevoPrecio = prompt('Nuevo precio:', producto.precio.toString());
    const nuevaImagen = prompt('Nueva imagen (URL):', producto.imagen);
    const nuevaDescripcion = prompt('Nueva descripción:', producto.descripcion);
    const nuevaCantidad = prompt('Nueva cantidad:', producto.cantidad.toString());

    if (nuevoNombre && nuevoPrecio && nuevaImagen && nuevaDescripcion && nuevaCantidad) {
      producto.nombre = nuevoNombre;
      producto.precio = parseFloat(nuevoPrecio);
      producto.imagen = nuevaImagen;
      producto.descripcion = nuevaDescripcion;
      producto.cantidad = parseFloat(nuevaCantidad);
    }
  }

  eliminarProducto(id: number) {
    this.inventario = this.inventario.filter(prod => prod.id !== id);
  }

  agregarMasProducto(producto: Producto) {
    // Ensure cantidad is treated as a number and increment it
    producto.cantidad = Number(producto.cantidad) + 1; 
  }
  

  agregarMenosProducto(producto: Producto) {
    if (Number(producto.cantidad) > 0) {
      producto.cantidad = (Number(producto.cantidad) - 1);
    }
  }

  // Función para generar el XML del inventario
  generarXMLInventario() {
    this.inventarioService.generarXMLInventario(this.inventario);
  }

  guardarCambiosXML() {
    this.inventarioService.guardarCambiosXML(this.inventario);
  }
  
  

}
