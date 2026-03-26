"use strict";

class Table{
    constructor(rowHeaders, colHeaders, table) {
        this.rowHeaders = rowHeaders;
        this.colHeaders = colHeaders;
        this.table = table;

        //check table
        if (!table.length == this.rowHeaders.length) {
            console.error("table row count is inequal to rowHeaders count!", table.length, rowHeaders.count);
        }
        table.forEach((row,i) => {
            if (!row.length == this.colHeaders.length) {
                console.error(`table row #${i+1} column count is inequal to colHeaders count!`, row.length, colHeaders.count);
            }
        });
    }

    get(rowName, colName) {
        let rowIndex = this.rowHeaders.indexOf(rowName);
        let colIndex = this.colHeaders.indexOf(colName);
        if (!(rowIndex >= 0) || !(colIndex >= 0)) {
            return undefined;
        }
        return this.table[rowIndex][colIndex];
    }
}
export default Table;
