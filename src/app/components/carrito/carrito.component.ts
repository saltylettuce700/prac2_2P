import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal'

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
  standalone: true
})
export class CarritoComponent {

  mensajeCompra: string = '';


  public payPalConfig?: IPayPalConfig;

  carrito : any []=[];
  constructor(private carritoService : CarritoService){};

  ngOnInit(){
    this.carrito=this.carritoService.obtenerCarrito();
    this.loadPaypalScript().then(() => this.initConfig());

  }

  eliminarProducto(index: number) { //Elimina y Actualiza la lista en tiempo real
    this.carrito.splice(index, 1);
    
  }

  agregarProducto(producto: Producto) {
    this.carritoService.agregarProducto(producto); // añade otro producto igual al del carrito
    console.log('Carrito actual:', this.carrito);

  }



  getTotalCarrito(): number {
    if (!this.carrito || !Array.isArray(this.carrito)) return 0;
  
    // Forzar a número para evitar errores con strings
    return this.carrito.reduce((total, producto) => total + Number(producto.precio || 0), 0);
  }
  
  


  generarXML(){
    this.carritoService.generarXML();
  }

  private initConfig(): void {

    const totalNumber = this.getTotalCarrito(); // número
    const total = totalNumber.toFixed(2);       // string, como lo quiere PayPal

    this.payPalConfig = {
    currency: 'MXN',
    clientId: 'AWdMwooZqA9OHIKgAw2HPfGUe2cGldQMg3Kheda291xotBOn2wiP6TplF3VaTwCLZJrNpGkcql06ayeK',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'MXN',
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'MXN',
                value: total
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'MXN',
                value: total,
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details : any)=> {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      console.log('onClientAuthorization - compra completada', data);
      this.mensajeCompra = '✅ ¡Gracias por tu compra! Tu pago fue procesado exitosamente.';
      this.carrito = []; 
      
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AWdMwooZqA9OHIKgAw2HPfGUe2cGldQMg3Kheda291xotBOn2wiP6TplF3VaTwCLZJrNpGkcql06ayeK&currency=MXN&intent=capture';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
  

}
