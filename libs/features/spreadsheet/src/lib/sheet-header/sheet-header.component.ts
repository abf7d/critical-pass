import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../constants';

@Component({
    selector: 'cp-sheet-header',
    templateUrl: './sheet-header.component.html',
    styleUrls: ['./sheet-header.component.scss'],
})
export class SheetHeaderComponent {
    public isEditing: boolean = false;
    public params: any;
    public displayName!: string;
    @ViewChild('text') text!: ElementRef;

    constructor(@Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,) {}

    @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;

    agInit(params: any): void {
        this.params = params;
        this.displayName = params.displayName;
    }

    onBlur(event: any) {
        const name = event.value;
        const headers$ = this.eventService.get(CONST.IMPORT_HEADERS_KEY);
        const headers = headers$.value as any[];
        const header = headers.find(h => h.field == this.params.column.colDef.field);
        header.headerName = name;
        headers$.next(headers);
    }

    enterPressed(){
      this.onBlur(this.displayName);
    }

    dblClick() {
      this.isEditing = !this.isEditing;
      setTimeout((_: any) => { 
        this.text.nativeElement.focus();
      },0);
    }

    onSortRequested(order: any, event: any) {
        this.params.setSort(order, event.shiftKey);
    }
}

