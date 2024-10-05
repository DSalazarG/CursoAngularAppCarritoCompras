import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  items: CartItem[] = []; //productos o items añadidos al carrito de compras

  total: number = 0; //total de todos los productos en el carrito de compras

  constructor(
    private router: Router,
    private sharingDataService: SharingDataService,
    private service: ProductService) { }

  onAddCartMain(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {
      const hasItem = this.items.find(item => {
        return item.product.id === product.id;
      })

      if (hasItem) {
        this.items = this.items.map(item => {
          if (item.product.id === product.id) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
      } else {
        this.items = [... this.items, { product: { ...product }, quantity: 1 }];
      }
      this.calculateTotal();
      this.saveSession();
      this.router.navigate(['/cart'], { state: { items: this.items, total: this.total } })
      Swal.fire({
        title: "Carrito de compras",
        text: "Nuevo producto agregado :)",
        icon: "success"
      });
    })
  }

  onDeleteCartMain(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      console.log(id + ' Se ha ejecutado el evento idProductEventEmitter')

      Swal.fire({
        title: "¿Estas seguro?",
        text: "Se eliminará este producto del carrito de compras!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {

          this.items = this.items.filter(item => item.product.id != id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart');
          }
          this.calculateTotal();
          this.saveSession();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/cart'], { state: { items: this.items, total: this.total } })
          })

          Swal.fire({
            title: "Borrado!",
            text: "Se ha eliminado el prodcuto del carrito de compras",
            icon: "success"
          });
        }
      });
    })

  }

  calculateTotal(): void {
    this.total = 0;
    this.items.forEach(item => {
      this.total += item.product.price * item.quantity;
    });
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items))
  }

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
    this.onDeleteCartMain();
    this.onAddCartMain();
  }
}
