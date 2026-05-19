<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/1224213385/25.2.2%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1327685)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->
# DevExtreme PivotGrid - Identify Grand Total and Total Cells in the calculateSummaryValue() Handler 

This example uses the [calculateSummaryValue](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#calculateSummaryValue) function to detect Grand Total and Total rows and columns in the DevExtreme [PivotGrid](https://js.devexpress.com/Documentation/Guide/UI_Components/PivotGrid/Overview/) and applies custom aggregation logic to each cell type.

![DevExtreme PivotGrid - Grand Totals and Totals Detection](images/grand-totals-and-totals-detection.png)

## Implementation Details 

The [calculateSummaryValue](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#calculateSummaryValue) function receives a [Summary Cell](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Summary_Cell/) object that exposes hierarchy traversal methods (such as, `parent()`, `children()`, `prev()`). Use these methods to determine cell type.

The following code detects cells within Grand Total and Total columns:

```JavaScript
calculateSummaryValue(cell) {
    const columnParent = cell.parent('column');

    const isGrandTotalColumn = !columnParent;
    const isTotalColumn = columnParent && !columnParent.parent('column');
    
    if (isGrandTotalColumn) {
        // custom logic
    }

    if (isTotalColumn) {
        // custom logic
    }
    // ...
}
```

The following code detects cells within Grand Total and Total rows:

```JavaScript
calculateSummaryValue(cell) {
    const rowParent = cell.parent("row");

    const isGrandTotalRow = !rowParent;
    const isTotalRow = rowParent && !rowParent.parent("row");
    
    if (isGrandTotalRow) {
        // custom logic
    }

    if (isTotalRow) {
        // custom logic
    }
    // ...
}
```

Detection is based on hierarchy depth. Each call to `parent()` moves one level up in the row or column hierarchy. A Grand Total cell has no parent (depth 0). A Total cell does have a parent but that parent does not have a parent of its own (depth 1). Regular cells are at depth 2 or deeper.

## Files to Review

- **Angular**
    - [app.component.ts](Angular/src/app/app.component.ts)
- **React**
    - [App.tsx](React/src/App.tsx)
- **Vue**
    - [HomeContent.vue](Vue/src/components/HomeContent.vue)
- **jQuery**
    - [index.js](jQuery/src/index.js)
- **ASP.NET Core**    
    - [Index.cshtml](ASP.NET%20Core/Views/Home/Index.cshtml)

## Documentation
- [Getting Started with PivotGrid](https://js.devexpress.com/Documentation/Guide/UI_Components/PivotGrid/Getting_Started_with_PivotGrid/)
- [PivotGrid API - calculateSummaryValue](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#calculateSummaryValue)
- [PivotGrid API - Summary Cell](https://js.devexpress.com/jQuery/Documentation/ApiReference/UI_Components/dxPivotGrid/Summary_Cell/)

<!-- feedback -->
## Does This Example Address Your Development Requirements/Objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-pivotgrid-grand-total-and-total-detection&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-pivotgrid-grand-total-and-total-detection&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
