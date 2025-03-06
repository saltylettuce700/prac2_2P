import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito:Producto[] = [];

  agregarProducto(producto:Producto){
    this.carrito.push(producto);
  }

  obtenerCarrito():Producto[]{
    return this.carrito;
  }


  generarXML():void{

    const folio = 123456; 
    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD, pero detiene en donde empieza el la T de TIME del formato 
    const clienteNombre = "Cliente Juaanito"; 
    const clienteEmail = "juanito@correo.com"; 

    let subtotal = 0;


    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<factura>\n`;
    xml += `  <info>\n`;
    xml += `    <folio>${folio}</folio>\n`;
    xml += `    <fecha>${fecha}</fecha>\n`;
    xml += `    <cliente>\n`;
    xml += `      <nombre>${clienteNombre}</nombre>\n`;
    xml += `      <email>${clienteEmail}</email>\n`;
    xml += `    </cliente>\n`;
    xml += `  </info>\n\n`;

    xml += `  <productos>\n`;

    this.carrito.forEach((producto) => {
      const subtotalProducto = producto.precio; 
      subtotal += subtotalProducto;

      xml += `    <producto>\n`;
      xml += `      <id>${producto.id}</id>\n`;
      xml += `      <descripcion>${producto.nombre}</descripcion>\n`;
      xml += `      <precio-unitario>${producto.precio}</precio-unitario>\n`;
      xml += `      <subtotal>${subtotalProducto}</subtotal>\n`;
      xml += `    </producto>\n`;
    });

    xml += `  </productos>\n\n`;

    const iva = subtotal * 0.16; // IVA del 16%
    const total = subtotal + iva;


    xml += `  <totales>\n`;
    xml += `    <subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `    <impuestos>\n`;
    xml += `      <iva>${iva.toFixed(2)}</iva>\n`;
    xml += `    </impuestos>\n`;
    xml += `    <total>${total.toFixed(2)}</total>\n`;
    xml += `  </totales>\n`;

    xml += `</factura>`;

    
    const blob = new Blob([xml],
      {type:'application/xml'}
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    //return xml;
  
  }

  

  
  //constructor() { }
}
