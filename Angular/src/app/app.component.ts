import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DxPivotGridModule, type DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import PivotGridDataSource, { type dxPivotGridSummaryCell } from 'devextreme/ui/pivot_grid/data_source';
import { Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DxPivotGridModule],
})
export class AppComponent {
  dataSource: PivotGridDataSource;

  constructor(service: Service) {
    this.dataSource = new PivotGridDataSource({
      store: service.getSales(),
      fields: [
        {
          dataField: 'region',
          area: 'row',
          caption: 'Region',
          expanded: true,
        },
        {
          dataField: 'category',
          area: 'row',
          caption: 'Category',
        },
        {
          dataField: 'year',
          area: 'column',
          caption: 'Year',
          dataType: 'number',
          expanded: true,
        },
        {
          dataField: 'quarter',
          area: 'column',
          caption: 'Quarter',
          expanded: true,
        },
        {
          dataField: 'sales',
          area: 'data',
          caption: 'Sales ($)',
          summaryType: 'sum',
          format: 'currency',
          calculateSummaryValue: this.calculateRowTotalsSummaryValue,
        },
        {
          dataField: 'sales',
          area: 'data',
          caption: 'Sales Average',
          summaryType: 'avg',
          format: 'currency',
          calculateSummaryValue: this.calculateColumnTotalsSummaryValue,
        },
      ],
    });
  }

  calculateColumnTotalsSummaryValue = (cell: dxPivotGridSummaryCell) => {
    const columnParent = cell.parent('column');

    const isGrandTotalColumn = !columnParent;
    const isTotalColumn = columnParent && !columnParent.parent('column');

    // Show 'Sales Average' only for Grand Total and Total Columns
    if (isGrandTotalColumn || isTotalColumn) {
      return cell.value();
    }

    return null;
  }

  calculateRowTotalsSummaryValue = (cell: dxPivotGridSummaryCell) => {
    const rowParent = cell.parent('row');

    const isGrandTotalRow = !rowParent;
    const isTotalRow = rowParent && !rowParent.parent('row');

    // +10% markup for Grand Total Row
    if (isGrandTotalRow) {
      return (cell.value(true) || 0) * 1.1;
    }

    // Running total for Total Rows
    if (isTotalRow) {
      const prevTotalRowCell = cell.prev('row');

      if (prevTotalRowCell) {
        return (cell.value(true) || 0) + (prevTotalRowCell.value(true) || 0);
      }
    }

    return cell.value();
  };

  onCellPrepared(e: DxPivotGridTypes.CellPreparedEvent) {
    if (e.area === 'row' && e.cell?.type === 'GT') {
      if (e.cellElement) {
        e.cellElement.textContent = 'Grand Total (+10%)';
      }
    }

    if (e.area !== 'data') return;

    const rowType = e.cell?.rowType;
    const columnType = e.cell?.columnType;

    if (rowType === 'GT' && columnType === 'GT') {
      e.cellElement?.classList.add('cell-both');
    } else if (rowType === 'GT') {
      e.cellElement?.classList.add('cell-grand-row');
    } else if (columnType === 'GT') {
      e.cellElement?.classList.add('cell-grand-col');
    } else if (rowType === 'T') {
      e.cellElement?.classList.add('cell-total-row');
    } else if (columnType === 'T') {
      e.cellElement?.classList.add('cell-total-col');
    }
  }
}
