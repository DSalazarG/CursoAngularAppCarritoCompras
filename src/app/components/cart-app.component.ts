import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { CartItem } from '../models/cartItem';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, CartComponent],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{

  products: Product[] = []; //productos que muestra el catalogo

  items: CartItem[] = []; //productos o items añadidos al carrito de compras

  constructor(private service: ProductService){}

  onAddCartMain(product: Product){
    this.items = [... this.items, {product: {... product}, quantity: 1}]
  }

  ngOnInit(): void {
    this.products = this.service.findAll();
  }
}
