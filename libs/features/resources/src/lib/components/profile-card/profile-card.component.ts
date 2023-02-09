import { SplitInterpolation } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Role, RoleSummary } from '@critical-pass/project/types';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
// import { ResourcesMainComponent } from '../resources-main/resources-main.component';

@Component({
    selector: 'cp-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit, OnChanges {
    @Input() options!: Role[];
    @Input() name!: string;
    @Input() assignedRoles!: RoleSummary[];
    @Input() index!: number;
    @Output() update = new EventEmitter<ResourceForm>();
    @Output() delete = new EventEmitter<number>();

    editing = false;
    role: any;

    myControl = new FormControl();
    filteredOptions!: Observable<Role[]>;

    ngOnInit() {
        this.role = this.assignedRoles[0]?.name;
    }

    deleteResource() {
        if (confirm('Continue with delete?')) {
            this.delete.emit(this.index);
        }
    }

    updateResource() {
        const role = this.options.find(o => o.name === this.role);
        if (role) {
            const roleIndex = this.options.indexOf(role);
            const resource = { name: this.name, roleIndex: roleIndex, resourceIndex: this.index };
            this.update.emit(resource);
            this.editing = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['options']) {
            this.options = changes['options'].currentValue;
            const role = this.options.find(r => r.name === this.role);
            if (role) {
                this.role = role?.name;
            }
        }
        if (changes['index'] != undefined) {
            this.index = changes['index'].currentValue;
        }
    }
}

export interface ResourceForm {
    name: string;
    resourceIndex: number;
    roleIndex: number;
}
