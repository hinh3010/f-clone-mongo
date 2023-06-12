const Excel = require('exceljs');

class ExportAction {
    constructor(){
        /**
         * @type {Partial<Excel.Alignment>}
         * @private
         */
        this._alignmentRow = { horizontal: 'left', vertical: 'top', wrapText: true }

        /**
         * @type {Partial<Excel.Alignment>}
         * @private
         */
        this._alignmentHeader = { horizontal: 'left', vertical: 'middle', wrapText: true }

        /**
        * @type {Partial<Excel.Borders>}
        * @private
        */
        this._borderRow = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        };

        /**
         * @type {Partial<Excel.Borders>}
         * @private
         */
        this._borderHeader = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        };

        /**
         * @type {Partial<Excel.Fill>}
         * @private
         */
        this._fillRow = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'eeeeee' },
            bgColor: { argb: 'eeeeee' }
        };

        /**
         * @type {Partial<Excel.Fill>}
         * @private
         */
        this._fillHeader = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '40bff5' },
            bgColor: { argb: '40bff5' }
        };
    }

    /**
     * @param {Excel.Cell} cell
     * @param {object} options
     * @param {string} options.bgColor
     * @param {string} options.borderColor
     * @param {string} options.textColor
     * @private
     */
    _styleCell(cell, options) {
        const { bgColor, borderColor, textColor } = options ?? {};
        if (bgColor) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: bgColor },
                bgColor: { argb: bgColor }
            };
        }
        if (borderColor) {
            cell.border = {
                top: { style: 'thin', color: { argb: borderColor } },
                left: { style: 'thin', color: { argb: borderColor } },
                bottom: { style: 'thin', color: { argb: borderColor } },
                right: { style: 'thin', color: { argb: borderColor } }
            };
        }
        if (textColor) {
            cell.font = {
                color: { argb: textColor }
            };
        }
        return cell;
    }

    /**
     * @param {Excel.Row} row
     * @param {object} options
     * @param {string} options.bgColor
     * @param {string} options.borderColor
     * @param {string} options.textColor
     * @param {number} options.height
     * @param {boolean} options.isApply
     * @private
     */
    _styleSheet(row, options) {
        const { bgColor, borderColor, height, textColor, isApply = true } = options ?? {};
        if (isApply) {
            row.eachCell((cell) => {
                if (bgColor) {
                    this._styleCell(cell, { bgColor });
                }
                if (borderColor) {
                    this._styleCell(cell, { borderColor });
                }
                if (textColor) {
                    this._styleCell(cell, { textColor });
                }
            });
        }
        if (height) row.height = 30;
        row.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true
        };
    }

    /**
     * @param {Excel.Worksheet} worksheet
     * @param {object} options
     * @param {Array<Partial<Excel.Column>>} options.columns
     * @param {any[]} options.data
     * @param {boolean} options.isMerge
     * @private
     */
    _createRows(worksheet, options) {

        const { columns, data, isMerge = false } = options ?? {};
        worksheet.columns = columns

        const header = worksheet.getRow(1)
        header.alignment = this._alignmentHeader
        header.fill = this._fillHeader
        header.border = this._borderHeader
        header.height = 20

        data.forEach((rowData, i) => {
            // let rowIndex = this._getSearchRowColumnA(worksheet, rowData.store)
            // console.log({ rowIndex })
            // if (rowIndex){
            //     worksheet.spliceRows(rowIndex, 1)
            // }
            worksheet.addRow(rowData)
            // const row = worksheet.addRow(rowData);
            // if(i % 2 ){ 
            //     row.fill = this._fillRow
            // }
            // row.border = this._borderRow
            // row.alignment = this._alignmentRow
        });
        
        return worksheet;
    }

    /**
     * @param {Excel.Worksheet} worksheet
     * @param {number} rowIndex
     * @param {any} values
     * @private
   */
    _overwriteRow(worksheet, rowIndex, values) {
        const row = worksheet.getRow(rowIndex);
        values.forEach((value, columnIndex) => {
            const cell = row.getCell(columnIndex + 1);
            cell.value = value;
        });
    }

    /**
    * @param {Excel.Worksheet} worksheet
    * @param {string} searchValue
    * @private
    */
    _getSearchRowColumnA(worksheet, searchValue) {
        const columnA = worksheet.getColumn(1);
        const rowIndex = columnA.values.map((value, rowNumber) => value === searchValue ? rowNumber : null).filter(Boolean)
        console.log("🚀 hello cac ban tre  ~ file: _ExportAction.js:188 ~ ExportAction ~ _getSearchRowColumnA ~ rowIndex~", rowIndex)
        return rowIndex[0]
    }

    
    /**
     * @param {Excel.Worksheet} worksheet
     * @param {Array<Partial<Excel.Column>>} columns
     * @private
     */
    _createHeader(worksheet, columns) {
        worksheet.columns = columns

        const header = worksheet.getRow(1)
        header.alignment = this._alignmentHeader
        header.fill = this._fillHeader
        header.border = this._borderHeader
        header.height = 20
    }

    /**
     * make data for file csv
     * 
     * @param {string[]} header 
     * @param {any[]} body 
     * @returns 
     */
    async exportCsv(header, body) {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');

        worksheet.addRow(header);

        body.forEach((item) => {
            worksheet.addRow(Object.values(item));
        });

        return workbook
    }

    /**
     * make data create excel file
     * 
     * @param {object} payload 
     * @param {string} payload.filePath 
     * @param {string} payload.sheetName 
     * @param {any[]} payload.header 
     * @param {any[]} payload.body 
     * @param {boolean|undefined} payload.isMerge 
     */
    async exportExcel({ filePath, sheetName, header, body, isMerge }) {
        const workbook = new Excel.Workbook();

        // create sheet
        const worksheet = workbook.addWorksheet(sheetName);

        // add rows
        this._createRows(worksheet, {
            columns: header,
            data: body,
            isMerge
        })

        // write file
        await workbook.xlsx.writeFile(filePath)
    }

    async sheetExists(filePath, sheetName) {
        try {
            const workbook = new Excel.Workbook();

            // read file
            await workbook.xlsx.readFile(filePath)

            let sheetExists = false;

            // check if sheet exists
            workbook.eachSheet((worksheet) => {
                if (worksheet.name === sheetName) {
                    sheetExists = true;
                }
            });

            return sheetExists
        } catch (error) {
            return false
        }
    }

    async addNewSheet({ filePath, sheetName, header, body }) {
        try {
            const workbook = new Excel.Workbook();

            // read file
            await workbook.xlsx.readFile(filePath)

            // check if sheet exists
            const currSheet = workbook.getWorksheet(sheetName)
            if (currSheet){
                // delete sheet
                workbook.removeWorksheet(currSheet.id)
            }

            // add new sheet
            const worksheet = workbook.addWorksheet(sheetName)

            // add rows
            this._createRows(worksheet, {
                columns: header,
                data: body,
            })

            // write file
            await workbook.xlsx.writeFile(filePath)

        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * make data create excel file
     * 
     * @param {object} payload 
     * @param {string} payload.filePath 
     * @param {string} payload.sheetName 
     * @param {any[]} payload.header 
     * @param {any[]} payload.body 
     */
    async createExcel({ filePath, sheetName, header, body }) {
        const workbook = new Excel.Workbook();

        // create sheet
        const worksheet = workbook.addWorksheet(sheetName);

        // add rows
        this._createRows(worksheet, {
            columns: header,
            data: body
        })

        // write file
        await workbook.xlsx.writeFile(filePath)
    }

    /**
    * add more rows to worksheet
    * 
    * @param {object} payload 
    * @param {string} payload.filePath
    * @param {string} payload.sheetName 
    * @param {any[]} payload.header 
    * @param {any[]} payload.body 
    */
    async updateExcel({ filePath, sheetName, header, body }) {
        const workbook = new Excel.Workbook();

        // read file
        await workbook.xlsx.readFile(filePath)

        // get sheet
        const worksheet = workbook.getWorksheet(sheetName)

        // add rows
        this._createRows(worksheet, {
            columns: header,
            data: body
        })

        // write file
        await workbook.xlsx.writeFile(filePath)
    }
}

module.exports = {
    ExportAction
};