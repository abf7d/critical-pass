import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { DataTable, Header, Mapping, Worksheet } from '../types';

@Injectable({
    providedIn: 'root',
})
export class TableFactoryService {
    constructor() {}

    public getTables(imported: Worksheet[], schema: Header[]): DataTable[] {
        return imported.map(sheet => {
            // const headers = this.getHeaders(sheet.data);
            const columnDefs = this.getColumnDefs(sheet.headers);
            this.setMatches(columnDefs, schema);
            const { name, data, headers } = sheet;
            const table = { headers, name, data, columnDefs } as DataTable;
            return table;
        });
    }

    private getColumnDefs(headers: string[]): ColDef[] {
        if (headers.length > 0) {
            const defs = headers.map(x => {
                return { field: x, headerName: x } as ColDef;
            });
            return defs;
        }
        return [];
    }

    public setMatches(colDef: ColDef[], schema: Header[] ) {
      schema.forEach( x => x.selected = false);
      const lowerSchema = schema.map( x => x.name.toLowerCase());
      colDef.forEach( c =>{
        let index = lowerSchema.indexOf(c.headerName!.toLowerCase());
        if( index > -1){
          c.headerClass = 'matched';
          schema[index].selected = true;

        } else {
          c.headerClass = 'unmatched'
        }
      });
    }

    public createSchema(headers: Mapping[]): Header[] {
      return headers.map( h => {return {name: h.fieldName, label: h.fieldName, selected: false, activityProp: h.activityProp} as Header})
    }
}
