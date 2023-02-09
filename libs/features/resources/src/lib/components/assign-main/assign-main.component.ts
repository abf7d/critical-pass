import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'cp-assign-main',
    templateUrl: './assign-main.component.html',
    styleUrls: ['./assign-main.component.scss'],
})
export class AssignMainComponent implements OnInit {
    public id: number;

    constructor(route: ActivatedRoute) {
        this.id = +route.snapshot.params['id'];
    }

    ngOnInit(): void {}
}
