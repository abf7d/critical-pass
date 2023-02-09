import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'cp-assign-change-charts',
    templateUrl: './assign-change-charts.component.html',
    styleUrls: ['./assign-change-charts.component.scss'],
})
export class AssignChangeChartsComponent {
    public id: number;
    public viewMultiverse = 'branching';

    constructor(route: ActivatedRoute) {
        this.id = +route.snapshot.params['id'];
    }
}
