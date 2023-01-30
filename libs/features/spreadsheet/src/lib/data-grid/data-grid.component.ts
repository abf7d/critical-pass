import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { TableFactoryService } from '../table-factory/table-factory.service';
import { SheetHeaderComponent } from '../sheet-header/sheet-header.component';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataTable, Header } from '../types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ImportMapperService, MappingFileManagerService } from '@critical-pass/shared/file-management'
import * as CONST from '../constants';
import { ProjectStorageApiService, API_CONST } from '@critical-pass/shared/data-access';
import { CORE_CONST } from '@critical-pass/core';

@Component({
    selector: 'cp-data-grid',
    templateUrl: './data-grid.component.html',
    styleUrls: ['./data-grid.component.scss'],

    encapsulation: ViewEncapsulation.None,
})
export class DataGridComponent implements OnInit {
    @ViewChild('agGrid') agGrid!: ElementRef;
    public hasBaseDropZoneOver = false;
    public hasAnotherDropZoneOver = false;
    public fileName = 'SheetJS.xlsx';
    public dateFormat = 'M/d/yyyy'; // <- usa  //European: d-M-YYYY
    public tables!: DataTable[];
    public activeTable: DataTable | null = null;
    public currentSchema$: Subject<Header[]>;
    public currentSchema: Header[];
    public frameworkComponents = { agColumnHeader: SheetHeaderComponent };
    public defaultColDef: ColDef;
    private delimiter = ',';
    private gridApi: any;

    public headers!: ColDef[];
    constructor(
        private fileManager: MappingFileManagerService,
        private factory: TableFactoryService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private storageApi: ProjectStorageApiService,
        private mapper: ImportMapperService,
        private router: Router,
    ) {
        this.currentSchema$ = this.eventService.get(CONST.IMPORT_SCHEMA);
        this.currentSchema = this.factory.createSchema(CONST.HEADER_MAPPING);
        this.currentSchema$.next(this.currentSchema);
        this.defaultColDef = CONST.DEFAULT_COL_DEF;
        this.currentSchema$.pipe(filter(x => !!this.gridApi && !!x)).subscribe(schema => {
            this.factory.setMatches(this.headers, schema);
            this.gridApi.setColumnDefs(this.headers);
            this.gridApi.refreshHeader();
        });
    }
    public ngOnInit(): void {}
    public saveFormat() {}
    public changeDateFormat(event: any) {}
    public createProject() {
        const snapshot = this.gridApi.getModel().gridOptionsService.gridOptions;
        const project = this.mapper.mapFromSheet(snapshot.columnDefs, snapshot.rowData, this.currentSchema);
        
        this.storageApi.set(API_CONST.SESSION_STORAGE, project);
        this.router.navigateByUrl(CORE_CONST.IMPORT_PROFILE_ROUTE);
    }
    public ngOnDestroy() {}
    public setActiveTable(table: DataTable) {
        this.activeTable = table;
        this.headers = table.columnDefs;
    }
    public onGridReady(params: any) {
        this.gridApi = params.api;
    }
    public fileSelected(event: any) {
        const files = event.files as FileList;
        const firstFile = files.item(0);

        if (firstFile !== null && files.length > 0) {
            this.fileManager.import(firstFile).then(worksheets => {
                this.tables = this.factory.getTables(worksheets, this.currentSchema);
                this.headers = this.tables[0].columnDefs;
                this.activeTable = this.tables[0];
                this.factory.setMatches(this.tables[0].columnDefs, this.currentSchema);
            });
        }
    }
}
