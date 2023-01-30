import { ColDef } from 'ag-grid-community';

export type ImportData = Array<Array<any>>;
export interface Worksheet {
    name: string;
    data: ImportData;
    headers: string[];
}
export interface DataTable {
    data: ImportData,
    name: string,
    headers: string[],
    columnDefs: ColDef[]
}

export interface Header {
    name: string;
    label: string;
    selected: boolean;
    activityProp: string;
}
export interface Mapping {
    fieldName: string;
    activityProp: string;
}
