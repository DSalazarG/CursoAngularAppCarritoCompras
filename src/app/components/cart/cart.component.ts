import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnChanges{
  @Input() items: CartItem[] = [];
  
  total: number = 0;
  
  @Output() idProductEventEmitter = new EventEmitter();
  
  ngOnChanges(changes: SimpleChanges): void {
    this.calculateTotal();
    this.saveSession();
  }

  onDeleteCart(id: number){
    this.idProductEventEmitter.emit(id);
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
}
