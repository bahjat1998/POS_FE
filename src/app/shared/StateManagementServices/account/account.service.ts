import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { StoreManagementService } from "../../Store/Store-Management.service";

@Injectable({
  providedIn: 'root'
})
export class GeneralTemplateOperations {
  changeScreenTitle$ = new Subject()
  shortCutDetection$ = new Subject()

  openPosItemsSearch$ = new Subject()
  closePosItemsSearch$ = new Subject()

  openPosInvoiceItemNote$ = new Subject()
  newItemAddedToCart$ = new Subject()
  openPosDeliveryCustomer$ = new Subject()

  openPosNoteToKitchen$ = new Subject()
  PosExpenseList$ = new Subject()

  openPosStockReport$ = new Subject()
  openPosAddExpense$ = new Subject()
  closePosAddExpense$ = new Subject()

  openPosStyleSetup$ = new Subject()
  openPosOrderDetails$ = new Subject()
  openPosOrdersList$ = new Subject()
  closePosOrdersList$ = new Subject()

  openPosSelectAccount$ = new Subject()
  closePosSelectAccount$ = new Subject()

  splitOrderPendingSourceIdArrived$ = new Subject()
  openPosMoveOrderItems$ = new Subject()
  closePosMoveOrderItems$ = new Subject()

  openPosPaymentScreen$ = new Subject()
  closePosPaymentScreen$ = new Subject()


  openPosSelectItemDetails$ = new Subject()
  closePosSelectItemDetails$ = new Subject()

  openPosShiftDetails$ = new Subject()
  closePosShiftDetails$ = new Subject()
  currentActiveShiftChanged$ = new Subject()

  openPosRemoveItem$ = new Subject()
  closePosRemoveItem$ = new Subject()
  constructor(private storeManagementService: StoreManagementService) { }

  async getStyle() {
    let layout: any = {};
    let style: any = await this.storeManagementService.getItem("StyleSetup")
    if (style) {
      layout = style;
    } else {
      layout = this.DefaultStyle;
    }
    return layout;
  }
  async refreshStyle() {
    let layout = await this.getStyle()
    setTimeout(() => {
      this.applyLayoutClasses(layout)
    }, 1);
  }

  applyLayoutClasses(Layout: any) {
    const body = document.getElementsByTagName("body")[0];
    (body.style as any).zoom = `${Layout.GeneralZoomOut}`;
    const wrapper = document.getElementById('categoryWrapper');
    const inner = document.getElementById('categoryInner');
    const itemsViewScroll: any = document.getElementById('itemsViewScroll');
    const leftBox: any = document.getElementById('leftBox');

    if (!wrapper || !inner) return;

    const layout = Layout.category.layout;
    const cols = Layout.category.cols;
    const width = Layout.category.width;
    const height = Layout.category.height;

    const color = Layout.category.color;
    const background = Layout.category.background;

    // Reset
    wrapper.className = 'cat-View-1';
    inner.className = '';

    if (layout === 'H') {
      wrapper.classList.add('overflow-x-auto', 'whitespace-nowrap', 'px-2');
      inner.classList.add('flex', 'gap-2');
      itemsViewScroll.classList.add('h-82vh');
    }

    if (layout === 'LV') {
      wrapper.classList.add('w-[229px]');
      inner.classList.add('space-y-3', 'h-100vh');
      leftBox.classList.add('flex');
      itemsViewScroll.classList.add('h-100vh');
    }

    if (layout === 'V') {
      inner.classList.add('gap-2', 'grid', `grid-cols-${cols}`);
      itemsViewScroll.classList.add('h-72vh');
    }

    // Add layout-based class to each item
    const items = document.querySelectorAll('.cartb');
    items.forEach((item: any) => {
      if (!Layout.category.withImage) {
        item.classList.add('no-image');
      }
      else {
        item.classList.remove('no-image');
      }
      // Apply width/height if provided

      if (width) item.style['width'] = `${width}px`;
      if (height) item.style['height'] = `${height}px`;


      if (color) item.style['color'] = `${color}`;
      if (background) item.style['background'] = `${background}`;
    });
    setTimeout(() => {
      this.applyCartStyles(Layout)
      this.applyItemStyles(Layout);
    }, 10);
  }

  applyCartStyles(Layout: any) {
    const itemsList = document.getElementById('itemsList');
    if (itemsList) {
      itemsList.style.removeProperty('height');
      itemsList.style.height = Layout.cart.itemsBoxHeight + Layout.cart.itemsBoxHeightU;
    }
  }
  applyItemStyles(Layout: any) {
    setTimeout(() => {
      const items = document.querySelectorAll('.itemb');
      items.forEach((item: any) => {

        if (!Layout.Items.withImage) {
          item.classList.add('no-image');
        }
        else {
          item.classList.remove('no-image');
        }
        if (Layout.Items.height) item.style['height'] = `${this.getPxOrRelated(Layout.Items.height)}`;
        if (Layout.Items.width) item.style['width'] = `${this.getPxOrRelated(Layout.Items.width)}`;
      });

      const itemsViewScroll: any = document.getElementById('itemsViewScroll');
      const itemsViewPort: any = document.getElementById('items-grid-setup');
      if (Layout.Items.boxHeight) {
        itemsViewScroll.style['height'] = `${this.getPxOrRelated(Layout.Items.boxHeight)}`
      }
      if (Layout.Items.boxHeightInner) {
        itemsViewPort.style['height'] = `${this.getPxOrRelated(Layout.Items.boxHeightInner)}`
      }

      const itmsGrid: any = document.getElementById('items-grid-setup');
      if (Layout.Items.cols) {
        itmsGrid.classList.add('gap-3');
        // itmsGrid.classList.add('gap-3', 'grid', `grid-cols-${Layout.Items.cols}`);
      }

      this.fixGridChunks()
      // const itmsGrid1: any = document.getElementById('items-grid-chunked');
      // if (Layout.Items.cols) {
      //   itmsGrid1.classList.add('gap-3', 'grid', `grid-cols-${Layout.Items.cols}`);
      // }
    }, 10);
  }
  async fixGridChunks() {
    let Layout: any = await this.getStyle();
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('items-grid-ch');
    if (Layout.Items.cols) {
      Array.from(elements).forEach((el: Element) => {
        el.classList.add('gap-3', 'grid', `grid-cols-${Layout.Items.cols}`);
      });
    }

  }
  getPxOrRelated(val: any, U = 'px') {
    if (Number(val)) return `${val}px`
    else if (val == 'full') return `100%`
    else return ''
  }
  DefaultStyle = {
    GeneralZoomOut: 1,
    category: {
      boxHeight: "",
      layout: 'H',
      cols: 4,
      withImage: true,
      width: 0,
      height: 0
    },
    cart: {
      itemsBoxHeight: '64',
      itemsBoxHeightU: 'vh'
    },
    Items: {
      withImage: true,
      style: 1, // 0 or 1
      height: 'full',
      width: 'full',
      boxHeight: 700,
      boxHeightInner: 630,
      cols: 4
    }
  }
}
