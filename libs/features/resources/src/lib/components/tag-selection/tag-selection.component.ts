import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssignFrameworkService } from '../../services/assign-framework/assign-framework.service';

@Component({
    selector: 'cp-tag-selection',
    templateUrl: './tag-selection.component.html',
    styleUrls: ['./tag-selection.component.scss'],
})
export class TagSelectionComponent implements OnInit {
    @Input() title!: string;
    @Input() nameAttr!: string;
    @Input() colorBucket!: string;
    @Input() items!: TagBase[];
    @Input() hideAssignLinks!: boolean;
    @Output() assignTags = new EventEmitter<string>();
    @Output() unassignTags = new EventEmitter<string>();
    @Output() selectTag = new EventEmitter<TagBase>();
    @Output() removeTag = new EventEmitter<TagBase>();
    @Output() addTag = new EventEmitter<string>();
    public newTag = '';
    constructor(private aManager: AssignFrameworkService) {}
    public assign = () => this.assignTags.emit();
    public removeAll = () => this.unassignTags.emit();
    public select = (tag: TagBase) => this.selectTag.emit(tag);
    public remove = (tag: TagBase) => this.removeTag.emit(tag);
    public add(event: any) {
        const name = event.value;
        this.addTag.emit(name);
        this.newTag = '';
    }
    public getTagColor = (tag: TagBase) => this.aManager.getColor(tag, this.colorBucket);
    public getName = (tag: any) => (this.nameAttr ? tag[this.nameAttr].name : tag['name']);
    public ngOnInit(): void {}
}

export interface TagBase {}
