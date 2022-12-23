import { Component } from '@angular/core';
import { ProjectApiService } from '@critical-pass/shared/data-access';

@Component({
    selector: 'critical-pass-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'explorer';
    constructor(projectApi: ProjectApiService) {}
}
