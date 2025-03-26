import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  constructor(private saleService: SaleService) {}
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log(page);

      this.currentPage = page;
      this.saleService.page = page;
      this.pageChanged.emit(page);
    }
  }
}
