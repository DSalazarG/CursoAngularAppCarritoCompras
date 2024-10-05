import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  constructor() { }

  private _idProductEventEmitter: EventEmitter<number> = new EventEmitter();
  private  _productEventEmitter: EventEmitter<Product> = new EventEmitter();

  get productEventEmitter(): EventEmitter<Product>{
    return this._productEventEmitter;
  }
  get idProductEventEmitter(): EventEmitter<number>{
    return this._idProductEventEmitter;
  }

}
