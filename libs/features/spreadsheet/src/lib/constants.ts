import { Mapping } from './types';

export const IMPORT_HEADERS_KEY = 'import.headers.key';
export const IMPORT_SCHEMA = 'import.headers.schema.key';
export const DEFAULT_COL_DEF = {
    width: 150,
    editable: true,
    resizable: true,
    headerClass: 'unmatched',
};
export const PROJECT_SCHEMA = ['Id', 'Task Name', 'Predecessors', 'Duration', 'Finish', 'Actual Finish'];
export const HEADER_MAPPING: Mapping[] = [
    { fieldName: 'Id', activityProp: 'id' },
    { fieldName: 'Name', activityProp: 'name' },
    { fieldName: 'Predecessors', activityProp: 'depends_on' },
    { fieldName: 'Duration', activityProp: 'duration' },
    { fieldName: 'Planned Completion Date', activityProp: 'planned_completion_date' },
    { fieldName: 'Finish', activityProp: 'finish' },
];
