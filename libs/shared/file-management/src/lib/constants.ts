// export const activitiesWsName = 'Activities';
// export const arrowWsName = 'Arrow Info';
// export const integrationWsName = 'Integrations';
// export const profileWsName = 'Profile';
// export const phasesWsName = 'Phases';
// export const rolesWsName = 'Roles';
// export const resourcesWsName = 'Resources';
// export const activityResourcesWsName = 'Activity Assigned Resources';
// export const activityPhasesWsName = 'Activity Assinged Phases';
// export const resourceRolesWsName = 'Resource Roles';

import { ColDef } from 'ag-grid-community';

export const ACTIVITIES_WS_NAME = 'Activities';
export const ARROW_WS_NAME = 'Arrow Info';
export const INTEGRATION_WS_NAME = 'Integrations';
export const PROFILE_WS_NAME = 'Profile';
export const SUB_PROJECT_WS_NAME = 'Sub-Parent Projects';
export const PHASES_WS_NAME = 'Phases';
export const ROLES_WS_NAME = 'Roles';
export const RESOURCES_WS_NAME = 'Resources';
export const ACTIVITY_RESOURCES_WS_NAME = 'Activity Assigned Resources';
export const ACTIVITY_PHASES_WS_NAME = 'Activity Assinged Phases';
export const RESOURCE_ROLES_WS_NAME = 'Resource Roles';

export const TAB_POOL_WS_NAME = 'Tag Pool';
export const ACTIVITY_TAG_WS_NAME = 'Activity Tags';

export const PARENT_NODE_ID_COL = 'parentNodeId';
export const NODE_ID_COL = 'nodeId';
export const RESOURCE_TAG_GROUP = 'Jira Assignee';
export class EXT {
    public static readonly XLSX = 'xlsx';
    public static readonly JSON = 'json';
}

export type ImportData = Array<Array<any>>;
export interface Worksheet {
    name: string;
    data: ImportData;
    headers: string[];
}
export interface DataTable {
    data: ImportData;
    name: string;
    headers: string[];
    columnDefs: ColDef[];
}

export interface Header {
    name: string;
    selected: boolean;
    activityProp: string;
}
export interface Mapping {
    fieldName: string;
    activityProp: string;
}
