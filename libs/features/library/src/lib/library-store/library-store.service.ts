import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';
// import { Project } from '@critical-pass/critical-charts';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LibraryStoreService {
    public maxProjectCount$: BehaviorSubject<number | null>;
    // public projects$: BehaviorSubject<Project[]>;
    public pageNumber$: BehaviorSubject<number | null>;
    constructor() {
        this.maxProjectCount$ = new BehaviorSubject<number | null>(null);
        this.pageNumber$ = new BehaviorSubject<number | null>(null);
    }
}
