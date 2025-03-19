import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as xml2js from 'xml2js';

import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { map, catchError  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  public inventario : Producto[] = []; 
  private xmlUrl = '/assets/productos.xml';

  constructor(private http: HttpClient) {}

  obtenerInventario(): Observable<any[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map(xml => {
        const parser = new xml2js.Parser({ explicitArray: false });
        let productos: any[] = [];

        parser.parseString(xml, (err, result) => {
          if (err) {
            console.error('Error al parsear el XML:', err);
            throw new Error('Error al parsear el XML');
          }
          
          if (result && result.productos && result.productos.producto) {
            productos = Array.isArray(result.productos.producto)
              ? result.productos.producto
              : [result.productos.producto];
          } else {
            console.warn('No se encontraron productos en el XML');
          }
        });

        return productos;
      }),
      catchError(error => {
        console.error('Error al obtener el inventario:', error);
        return throwError(() => new Error('Error al obtener el inventario'));
      })
    );
  }

  // Generar XML de todo el inventario
  // Generar XML de todo el inventario
generarXMLInventario(inventario: Producto[]): void {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n`;

  // Asegurarse de que el inventario contiene productos
  if (inventario.length > 0) { // Aquí verificamos el inventario recibido como parámetro

    inventario.forEach((producto) => {
      xml += `  <producto>\n`;
      xml += `    <id>${producto.id}</id>\n`;
      xml += `    <nombre>${producto.nombre}</nombre>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${producto.imagen}</imagen>\n`;
      xml += `    <descripcion>${producto.descripcion}</descripcion>\n`;
      xml += `    <cantidad>${producto.cantidad}</cantidad>\n`;
      xml += `  </producto>\n`;
    });

  } else {
    console.log("No hay productos en el inventario.");
  }

  xml += `</productos>`;

  // Crear un blob para descargar el archivo
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventario.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


guardarCambiosXML(inventario: Producto[]): void {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n`;

  if (inventario.length > 0) {
    inventario.forEach((producto) => {
      xml += `  <producto>\n`;
      xml += `    <id>${producto.id}</id>\n`;
      xml += `    <nombre>${producto.nombre}</nombre>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${producto.imagen}</imagen>\n`;
      xml += `    <descripcion>${producto.descripcion}</descripcion>\n`;
      xml += `    <cantidad>${producto.cantidad}</cantidad>\n`;
      xml += `  </producto>\n`;
    });
  } else {
    console.log('No hay productos en el inventario.');
  }

  xml += `</productos>`;

  // Enviar al backend para reemplazar el XML
  this.http.post('/api/guardar-xml', { xml }).subscribe({
    next: () => {
      alert('Cambios guardados correctamente');
    },
    error: (error) => {
      console.error('Error al guardar el XML:', error);
      alert('Hubo un error al guardar los cambios');
    }
  });
}

  


}
