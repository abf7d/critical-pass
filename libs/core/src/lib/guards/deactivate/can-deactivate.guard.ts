import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EventService } from '@critical-pass/critical-charts';
import { ComponentCanDeactivate } from './component-can-deactivate';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(private eventService: EventService) {}
    canDeactivate(component: ComponentCanDeactivate): boolean {
        if (!component.canDeactivate()) {
            if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
                this.eventService.ngOnDestroy();
                return true;
            } else {
                return false;
            }
        }
        this.eventService.ngOnDestroy();
        return true;
    }
}
