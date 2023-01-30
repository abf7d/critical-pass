import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cp-file-bar',
    templateUrl: './file-bar.component.html',
    styleUrls: ['./file-bar.component.scss'],
})
export class FileBarComponent implements OnInit {
    public hasBaseDropZoneOver = false;
    public hasAnotherDropZoneOver = false;

    public data: any;
    public fileName = 'SheetJS.xlsx';
    public worksheettype = 'number';
    public worksheetnumber = 0;
    public worksheetname = '';
    public headerFormat = 'custom';
    public dateFormat = 'M/D/YYYY'; // <- usa  //European: D-M-YYYY

    constructor() {}
    public ngOnInit(): void {}
    // public exportexcel(activities: any): void {}
    // public saveFormat() {}
    // public changeDelimiter(value) {}
    // public changeHeaderFormat(value) {}
    // public changeDateFormat(value) {}
    // public ngOnDestroy() {}
    // public fileOverBase(e: any): void {}
    // public fileOverAnother(e: any): void {}
    // public fileDropped(files: FileList): void {}
    // public filesSelected($event): void {}
    // public fileSelected($event): void {}
}
