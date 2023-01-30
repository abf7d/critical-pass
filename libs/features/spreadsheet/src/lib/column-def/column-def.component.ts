import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Header } from '../types';
import * as CONST from '../constants';

@Component({
    selector: 'cp-column-def',
    templateUrl: './column-def.component.html',
    styleUrls: ['./column-def.component.scss'],
})
export class ColumnDefComponent {
    public isEditing: boolean = false;
    public params: any;
    public displayName!: string;

    @Input() header!: Header;
    @ViewChild('text') text!: ElementRef;

    constructor(@Inject(EVENT_SERVICE_TOKEN) private eventService: EventService) {}

    // TODO: This used to be pManager.getChannel, if eventservice doesn't work here then look at library branch
    onBlur(event: any) {
        const name = event.value;
        // TODO get schema, rename the header, and broadcast
        const schema$ = this.eventService.get(CONST.IMPORT_SCHEMA);
        const schema = schema$.value as Header[];
        const header = schema.find(h => h.activityProp == this.header.activityProp);
        if (header) {
            header.name = name;
        }
        schema$.next(schema);
        this.isEditing = false;
    }

    enterPressed() {
        this.onBlur(this.header.name);
    }

    dblClick() {
        this.isEditing = !this.isEditing;
        setTimeout((_: any) => {
            this.text.nativeElement.focus();
        }, 0);
    }

    onSortRequested(order: any, event: any) {
        this.params.setSort(order, event.shiftKey);
    }
}
