import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useMemo } from 'react';

const DataTable = ({ rowData, columnDefs, onCellValueChanged }) => {
    const pagination = true;
    const paginationPageSize = 400;
    const paginationPageSizeSelector = [400, 800, 1000];

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            editable: true,
        };
    }, []);

    return (
        <div className="ag-theme-quartz-dark w-full" style={{ height: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellValueChanged={onCellValueChanged}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
            />
        </div>
    );
};

export default DataTable;