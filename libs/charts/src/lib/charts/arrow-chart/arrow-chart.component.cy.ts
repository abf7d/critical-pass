import { TestBed } from '@angular/core/testing';
import { ProjectCompilerService } from '@critical-pass/project/processor';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { BehaviorSubject } from 'rxjs';
import { ArrowChartComponent } from './arrow-chart.component';
import { ArrowChartModule } from './arrow-chart.module';
let data: Project | undefined;
let dashboard: DashboardService;
let serializer = new ProjectSerializerService();
const activeProject$ = new BehaviorSubject<Project>(serializer.fromJson());
let mockDashboard = {
    activeProject$,
    updateProject: (project: Project) => {
        activeProject$.next(project);
    },
};
before(function () {
    cy.fixture('project.json').then(function (json) {
        data = json;
        cy.task('log', { message: 'This will be output to the terminal' });
        if (data) {
            const project = serializer.fromJson(data);
            mockDashboard.updateProject(project);
        }
    });
});
describe(ArrowChartComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ArrowChartComponent, {
            add: {
                imports: [ArrowChartModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: mockDashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 0,
                width: 0,
                height: 0,
                rebuild: false,
                showFastCreator: true,
            },
        });
    });
});
