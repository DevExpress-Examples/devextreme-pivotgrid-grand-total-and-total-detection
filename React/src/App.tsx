import { useMemo, useCallback } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import PivotGridDataSource, { type dxPivotGridSummaryCell } from 'devextreme/ui/pivot_grid/data_source';
import PivotGrid, { type PivotGridTypes } from 'devextreme-react/pivot-grid';
import { salesData } from './data';

function App(): JSX.Element {
  const calculateColumnTotalsSummaryValue = useCallback((cell: dxPivotGridSummaryCell) => {
    const columnParent = cell.parent('column');

    const isGrandTotalColumn = !columnParent;
    const isTotalColumn = columnParent && !columnParent.parent('column');

    // Show 'Sales Average' only for Grand Total and Total Columns
    if (isGrandTotalColumn || isTotalColumn) {
      return cell.value();
    }

    return null;
  }, []);

  const calculateRowTotalsSummaryValue = useCallback((cell: dxPivotGridSummaryCell) => {
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
  }, []);

  const dataSource = useMemo<PivotGridTypes.Properties['dataSource']>(
    () => new PivotGridDataSource({
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
    }),
    [],
  );

  const onCellPrepared = useCallback((e: PivotGridTypes.CellPreparedEvent) => {
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
  }, []);

  return (
    <div className='demo-container'>
      <div className='long-title'>
        <h3>
          Grand Totals and Totals Detection using{' '}
          <code>calculateSummaryValue</code>
        </h3>
      </div>

      <PivotGrid
        id='pivotgrid'
        dataSource={dataSource}
        showBorders={true}
        showColumnTotals={true}
        showRowTotals={true}
        showColumnGrandTotals={true}
        showRowGrandTotals={true}
        allowExpandAll={true}
        onCellPrepared={onCellPrepared}
      />

      <div className='legend'>
        <span className='legend-title'>Legend:</span>
        <span className='pill pill-grand-row'>Grand Total Row</span>
        <span className='pill pill-grand-col'>Grand Total Column</span>
        <span className='pill pill-both'>Grand Total Row ∩ Column</span>
        <span className='pill pill-total-row'>Total Row</span>
        <span className='pill pill-total-col'>Total Column</span>
      </div>
    </div>
  );
}

export default App;
