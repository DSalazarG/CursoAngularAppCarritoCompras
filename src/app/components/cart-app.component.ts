import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, CartComponent, NavbarComponent],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{

  products: Product[] = []; //productos que muestra el catalogo

  items: CartItem[] = []; //productos o items añadidos al carrito de compras

  total: number = 0; //total de todos los productos en el carrito de compras

  showCart: boolean = false;

  constructor(private service: ProductService){}

  onAddCartMain(product: Product): void{
    const hasItem = this.items.find(item => {
      return item.product.id === product.id;
    })

    if(hasItem){
      this.items = this.items.map(item =>{
        if(item.product.id === product.id){
            return {... item, quantity: item.quantity + 1}
        } 
        return item
      })
    }else{
      this.items = [... this.items, {product: {... product}, quantity: 1}];
    }
    this.calculateTotal();
    this.saveSession();
  }

  onDeleteCartMain(id: number): void{
    this.items = this.items.filter(item => item.product.id != id);
    this.calculateTotal();
    this.saveSession();

  }

  calculateTotal(): void{
    this.total = 0;
    this.items.forEach(item => {
      this.total += item.product.price * item.quantity;
    });
  }

  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items))
  }

  openCart(): void{
    this.showCart = !this.showCart;
  }

  ngOnInit(): void {
    this.products = this.service.findAll();
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
  }
}
