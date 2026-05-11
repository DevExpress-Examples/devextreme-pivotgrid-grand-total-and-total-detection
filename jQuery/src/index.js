$(() => {
  const dataSource = new DevExpress.data.PivotGridDataSource({
    store: salesData,
    fields: [
      {
        dataField: "region",
        area: "row",
        caption: "Region",
        expanded: true,
      },
      {
        dataField: "category",
        area: "row",
        caption: "Category",
      },
      {
        dataField: "year",
        area: "column",
        caption: "Year",
        dataType: "number",
        expanded: true,
      },
      {
        dataField: "quarter",
        area: "column",
        caption: "Quarter",
        expanded: true,
      },
      {
        dataField: "sales",
        area: "data",
        caption: "Sales ($)",
        summaryType: "sum",
        format: "currency",
        calculateSummaryValue: calculateRowTotalsSummaryValue,
      },
      {
        dataField: "sales",
        caption: "Sales Average",
        area: "data",
        summaryType: "avg",
        format: "currency",
        calculateSummaryValue: calculateColumnTotalsSummaryValue,
      },
    ],
  });

  $("#pivotGrid").dxPivotGrid({
    dataSource,
    showBorders: true,
    showColumnTotals: true,
    showRowTotals: true,
    showColumnGrandTotals: true,
    showRowGrandTotals: true,
    allowExpandAll: true,
    onCellPrepared(e) {
      if (e.area === "row" && e.cell.type === "GT") {
        e.cellElement.text("Grand Total (+10%)");
      }

      if (e.area !== "data") return;

      const rowType = e.cell.rowType;
      const columnType = e.cell.columnType;

      if (rowType === "GT" && columnType === "GT") {
        e.cellElement.addClass("cell-both");
      } else if (rowType === "GT") {
        e.cellElement.addClass("cell-grand-row");
      } else if (columnType === "GT") {
        e.cellElement.addClass("cell-grand-col");
      } else if (rowType === "T") {
        e.cellElement.addClass("cell-total-row");
      } else if (columnType === "T") {
        e.cellElement.addClass("cell-total-col");
      }
    },
  });
});

// Detect Grand Total and Total Columns
function calculateColumnTotalsSummaryValue(cell) {
  const columnParent = cell.parent("column");

  const isGrandTotalColumn = !cell.parent("column");
  const isTotalColumn = columnParent && !columnParent.parent("column");

  // Show 'Sales Average' data only for Grand Total and Total Columns
  if (isGrandTotalColumn || isTotalColumn) {
    return cell.value();
  }
  return null;
}

// Detect Grand Total and Total Rows
function calculateRowTotalsSummaryValue(cell) {
  const rowParent = cell.parent("row");

  const isGrandTotalRow = !cell.parent("row");
  const isTotalRow = rowParent && !rowParent.parent("row");

  // +10% markup for Grand Total Row
  if (isGrandTotalRow) {
    return (cell.value(true) || 0) * 1.1;
  }

  // Running total for Total Rows
  if (isTotalRow) {
    const prevTotalRowCell = cell.prev("row");
    if (prevTotalRowCell)
      return (cell.value(true) || 0) + (prevTotalRowCell.value(true) || 0);
  }
  return cell.value();
}