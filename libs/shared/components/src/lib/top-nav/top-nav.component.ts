import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@critical-pass/auth';
@Component({
    selector: 'cp-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
    constructor(private router: Router, private msalService: MsalService) {}

    ngOnInit(): void {}

    navigate(url: string) {
        this.router.navigateByUrl(url);
    }

    logout() {
        this.msalService.logout();
    }
}
