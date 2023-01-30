import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImportData, Worksheet } from '../constants';
import { FileManagerBaseService } from '../file-manager-base.service';
@Injectable({
    providedIn: 'root',
})
export class MappingFileManagerService implements FileManagerBaseService<Worksheet[]> {
    public export(spreadsheet: Worksheet[]): void {}

    private getHeaderRow(sheet: XLSX.WorkSheet): string[] {
        var headers = [];
        if (sheet['!ref'] === undefined) {
            return [];
        }
        var range = XLSX.utils.decode_range(sheet['!ref']);

        var C,
            R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for (C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */

            var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
            if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

            headers.push(hdr);
        }
        return headers;
    }

    public import(file: File): Promise<Worksheet[]> {
        return new Promise<Worksheet[]>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e: any) => {
                const binarystr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true });
                const worksheets = wb.SheetNames.map(name => {
                    const sheet = wb.Sheets[name];
                    const data = <ImportData>XLSX.utils.sheet_to_json(sheet, { raw: true });
                    const headers = this.getHeaderRow(sheet);
                    return { name, data, headers } as Worksheet;
                });
                resolve(worksheets);
            };
        });
    }
}
