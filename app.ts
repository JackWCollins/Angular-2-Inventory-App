import {
  Component,
  EventEmitter
} from 'angular2/core';

import {bootstrap} from 'angular2/platform/browser';

class Product {
  constructor(
      public sku: string,
      public name: string,
      public imageUrl: string,
      public department: string[],
      public price: number
  ) {

  }
}

@Component({
  selector: 'inventory-app',
  directives: [ProductsList],
  template: `
    <div class="inventory-app">
      <products-list [productList]="products" (onProductSelected)="selectProduct($event)"></products-list>
    </div>
  `,
})

class InventoryApp {
  products: Product[];

  constructor() {
    this.products = [
      new Product(
          'NICEHAT',
          'A Nice Black Hat',
          '/resources/images/products/black-hat.jpg',
          ['Men', 'Accessories', 'Hats'],
          29.99
      ),
      new Product(
          'NEATOJACKET',
          'Blue Jacket',
          '/resources/images/products/blue-jacket.jpg',
          ['Women', 'Apparel', 'Jackets & Vests'],
          238.99
      ),
      new Product(
          'MYSHOES',
          'Black Running Shoes',
          '/resources/images/products/black-shoes.jpg',
          ['Men', 'Shoes', 'Running Shoes'],
          109.99
      )
    ];
  }

  selectProduct(product: Product): void {
    console.log('Product clicked: ', product);
  }
}

@Component({
  selector: 'products-list',
  directives: [ProductRow],
  inputs: ['productList'],
  outputs: ['onProductSelected'],
  template: `
    <div class="ui items">
        <product-row *ngFor="#product of productList"
                     [product]="product"
                     (click)="clicked(product)"
                     [class.selected]="isSelected(product)">
        </product-row>
    </div>
  `,
})

class ProductsList {
    productList: Product[];
    onProductSelected: EventEmitter<Product>;
    currentProduct: Product;
    constructor() {
        this.onProductSelected = new EventEmitter();
    }

    clicked(product: Product): void {
        this.currentProduct = product;
        this.onProductSelected.emit(product);
    }

    isSelected(product: Product): boolean {
        if (!product || !this.currentProduct) {
            return false;
        }
        return product.sku === this.currentProduct.sku;
    }
}

@Component({
    selector: 'product-row',
    inputs: ['product'],
    host: {'class': 'item'},
    directives: [ProductImage, ProductDepartment, PriceDisplay],
    template: `
        <product-image [product]="product"></product-image>
        <div class="content">
            <div class="header">{{ product.name }}</div>
            <div class="meta">
                <div class="product-sku">SKU #{{ product.sku}}</div>
            </div>
            <div class="description">
                <product-department [product]="product"></product-department>
            </div>
        </div>
        <price-display [price]="product.price"></price-display>
    `,
})

class ProductRow {
    product: Product;
}

@Component({
    selector: 'product-image',
    host: {class: 'ui small image'},
    inputs: ['product'],
    template: `
        <img class="product-image" [src]="product.imageUrl">
    `,
})

class ProductImage {
    product: Product;
}

@Component({
    selector: 'price-display',
    inputs: ['price'],
    template: `
        <div class="price-display">\${{ price }}</div>
    `,
})

class PriceDisplay {
    price: number;
}

@Component({
    selector: 'product-department',
    inputs: ['product'],
    template: `
        <div class="product-department">
            <span *ngFor="#name of product.department; #i=index">
                <a href="#">{{ name }}</a>
                <span>{{ i < (product.department.length-1) ? '>' : '' }}</span>
            </span>
        </div>
    `,
})

class ProductDepartment {
    product: Product;
}

bootstrap(InventoryApp)