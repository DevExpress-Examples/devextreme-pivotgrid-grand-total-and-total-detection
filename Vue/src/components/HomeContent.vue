<script setup lang="ts">
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DxPivotGrid, { type DxPivotGridTypes } from 'devextreme-vue/pivot-grid';
import PivotGridDataSource, { type dxPivotGridSummaryCell } from 'devextreme/ui/pivot_grid/data_source';
import { salesData } from '../data';

function calculateColumnTotalsSummaryValue(cell: dxPivotGridSummaryCell) {
  const columnParent = cell.parent('column');

  const isGrandTotalColumn = !columnParent;
  const isTotalColumn = columnParent && !columnParent.parent('column');

  // Show 'Sales Average' only for Grand Total and Total Columns
  if (isGrandTotalColumn || isTotalColumn) {
    return cell.value();
  }

  return null;
}

function calculateRowTotalsSummaryValue(cell: dxPivotGridSummaryCell) {
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
}

const dataSource: PivotGridDataSource = new PivotGridDataSource({
  store: salesData,
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
      calculateSummaryValue: calculateRowTotalsSummaryValue,
    },
    {
      dataField: 'sales',
      area: 'data',
      caption: 'Sales Average',
      summaryType: 'avg',
      format: 'currency',
      calculateSummaryValue: calculateColumnTotalsSummaryValue,
    },
  ],
});

const onCellPrepared = (e: DxPivotGridTypes.CellPreparedEvent) => {
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
};
</script>

<template>
  <div>
    <div className="long-title">
      <h3>
        Grand Totals and Totals Detection using <code>calculateSummaryValue</code>
      </h3>
    </div>

    <DxPivotGrid
      id="pivotgrid"
      :data-source="dataSource"
      :show-borders="true"
      :show-column-totals="true"
      :show-row-totals="true"
      :show-column-grand-totals="true"
      :show-row-grand-totals="true"
      :allow-expand-all="true"
      @cell-prepared="onCellPrepared"
    />

    <div className="legend">
      <span className="legend-title">Legend:</span>
      <span className="pill pill-grand-row">Grand Total Row</span>
      <span className="pill pill-grand-col">Grand Total Column</span>
      <span className="pill pill-both">Grand Total Row ∩ Column</span>
      <span className="pill pill-total-row">Total Row</span>
      <span className="pill pill-total-col">Total Column</span>
    </div>
  </div>
</template>

<style>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
}

.legend-title {
  font-weight: 700;
  margin-right: 4px;
}

.pill {
  padding: 3px 10px;
  border-radius: 3px;
  font-weight: 600;
}

.long-title h3 {
  font-family:
    "Segoe UI Light", "Helvetica Neue Light", "Segoe UI", "Helvetica Neue",
    "Trebuchet MS", Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

#pivotgrid .cell-grand-row,
#pivotgrid .cell-grand-col,
#pivotgrid .cell-both,
#pivotgrid .cell-total-row,
#pivotgrid .cell-total-col {
  font-weight: 600;
}

/* Grand Totals */
#pivotgrid .cell-grand-row,
.pill-grand-row {
  background: #cce0f5;
  color: #1a3a5c;
}

#pivotgrid .cell-grand-col,
.pill-grand-col {
  background: #ddeaf9;
  color: #1a3a5c;
}

#pivotgrid .cell-both,
.pill-both {
  background: #b8d4f0;
  color: #0d2440;
  font-weight: 700;
}

/* Totals */
#pivotgrid .cell-total-row,
.pill-total-row {
  background: #fde8cc;
  color: #7a4000;
}

#pivotgrid .cell-total-col,
.pill-total-col {
  background: #fbd4a8;
  color: #7a4000;
}
</style>
