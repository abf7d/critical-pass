import { Inject, Injectable, NgZone } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProjectTreeStateService } from '../project-tree-state/project-tree-state';
import * as d3 from 'd3';
import { TreeOperationsService } from '../tree-operations/tree-operations.service';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../../../constants/constants';
import { Project, TreeNode } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';

@Injectable({
    providedIn: 'root',
})
export class ProjectTreeUiService {
    private commitSub!: Subscription;
    private branchSub!: Subscription;
    private resetSub!: Subscription;
    private loadTreeSub!: Subscription;
    private id!: number;
    private project!: Project;
    private isInitialized = false;
    private selectedNode$!: Subject<number>;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private projectSerializer: ProjectSerializerService,
        private ops: TreeOperationsService,
        private ngZone: NgZone,
        private st: ProjectTreeStateService,
    ) {}

    private initSubs() {
        this.selectedNode$ = this.eventService.get(CONST.SELECTED_TREE_NODE_KEY);

        this.commitSub = this.eventService
            .get(CONST.COMMIT_KEY)
            .pipe(filter(x => !!x))
            .subscribe(_ => this.commit());

        this.branchSub = this.eventService
            .get(CONST.BRANCH_KEY)
            .pipe(filter(x => !!x))
            .subscribe(_ => this.branch());

        this.resetSub = this.eventService
            .get(CONST.RESET_KEY)
            .pipe(filter(x => !!x))
            .subscribe(_ => this.reset());

        this.loadTreeSub = this.eventService
            .get<TreeNode[]>(CONST.LOAD_TREE_KEY)
            .pipe(filter(x => !!x))
            .subscribe(nodes => this.loadTree(nodes));

        this.selectedNode$.pipe(filter(x => x !== undefined)).subscribe(id => this.selectNode(id));
    }

    private commit() {
        const array = this.ops.commit(this.project);
        this.eventService.get(CONST.HISTORY_ARRAY_KEY).next(array);
        if (this.st.selected !== null) {
            this.selectedNode$.next(this.st.selected.id);
        }
        this.drawChart();
    }

    private branch() {
        const array = this.ops.branch(this.project);
        this.eventService.get(CONST.HISTORY_ARRAY_KEY).next(array);
        if (this.st.selected !== null) {
            this.selectedNode$.next(this.st.selected.id);
        }
        this.drawChart();
    }

    private reset() {
        const seedNode = this.ops.reset();
        const curWorkingProj = this.projectSerializer.fromJson(seedNode.data);
        this.dashboard.updateProject(curWorkingProj, true);
        if (this.st.selected !== null) {
            this.selectedNode$.next(this.st.selected.id);
        }
        this.eventService.get(CONST.HISTORY_ARRAY_KEY).next([]);
        this.drawChart();
    }

    private loadTree(nodes: TreeNode[]) {
        const workingProj = this.ops.loadState(nodes);
        this.dashboard.updateProject(workingProj, true);
        this.eventService.get(CONST.HISTORY_ARRAY_KEY).next(nodes);
        this.drawChart();
        this.selectedNode$.next(this.st.selected?.id!);
    }

    private selectNode(id: number) {
        this.ops.selectNode(id);
        if (this.st.selected !== null && this.st.selected.data !== null) {
            this.dashboard.updateProject(this.st.selected.data, true);
        }
        this.drawChart();
    }

    public init(width: number, height: number, id: number, el: any): void {
        this.id = id;
        this.st.latestId = CONST.INITIAL_NODE_COUNT;
        this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
        this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
        this.initSvg(width, height, el);
        this.initZoom();
        this.initSubs();
        this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.project = project;
                if (!this.isInitialized) {
                    if (!this.st.head) this.ops.initializeHeadNode(project);
                    this.drawChart();
                }
                this.isInitialized = true;
            });
        });
    }

    public initZoom() {
        const zoom = d3
            .zoom()
            .on('zoom', (event: any, d: any) => {
                this.st.mainG.attr('transform', event.transform);
            })
            .scaleExtent([1, 1]);
        this.st.svg.call(zoom);

        // this fixes a jump when you first drag the chart. The transform translate
        // in initSvg moves the elements, but this inits the zoom enviornment
        d3.zoom().translateBy(this.st.svg, this.st.margin.left, this.st.margin.top);
    }

    public clearEventState() {
        this.eventService.get(CONST.COMMIT_KEY).next(undefined);

        this.eventService.get(CONST.BRANCH_KEY).next(undefined);

        this.eventService.get(CONST.RESET_KEY).next(undefined);

        this.eventService.get(CONST.LOAD_TREE_KEY).next(undefined);
    }

    public destroy(): void {
        this.reset();
        if (this.commitSub) {
            this.commitSub.unsubscribe();
        }
        if (this.branchSub) {
            this.branchSub.unsubscribe();
        }
        if (this.resetSub) {
            this.resetSub.unsubscribe();
        }
        if (this.loadTreeSub) {
            this.loadTreeSub.unsubscribe();
        }
        this.st.reset();
        this.isInitialized = false;
        this.clearEventState();
    }

    public initSvg(width: number, height: number, el: any): void {
        const st = this.st;
        const svgclass = 'tree-s-' + this.id;
        d3.select(el).select('svg').remove();
        const svg = d3.select(el).append('svg').attr('class', svgclass);
        this.st.svg = svg.style('width', '100%').style('height', null).attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${width} ${height}`);

        st.mainG = st.svg.append('g').attr('transform', 'translate(' + this.st.margin.left + ',' + this.st.margin.top + ')');
    }

    private drawChart(): void {
        this.st.mainG.selectAll('*').remove();
        let tree = d3.tree().size([this.st.innerHeight!, this.st.innerWidth!]);
        const layout = d3.hierarchy(this.st.head);
        const newHeight = layout.height * 75;
        tree = tree.size([this.st.innerWidth!, newHeight]);
        const nodes = tree(layout);
        const links = layout.descendants().slice(1);
        this.st.mainG
            .selectAll('.link-tree')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'link-tree')
            .attr('stroke', '2px')
            .attr(
                'd',
                (d: any) =>
                    'M' +
                    d.x +
                    ',' +
                    d.y +
                    'C' +
                    d.x +
                    ',' +
                    (d.y + d.parent.y) / 2 +
                    ' ' +
                    d.parent.x +
                    ',' +
                    (d.y + d.parent.y) / 2 +
                    ' ' +
                    d.parent.x +
                    ',' +
                    d.parent.y,
            );

        const node = this.st.mainG.selectAll('.node-tree').data(nodes.descendants()).enter().append('g');
        node.append('circle')
            .attr('class', 'node-tree')
            .attr('r', 8)
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)
            .classed('selected', (d: any) => d.data?.id === this.st.selected?.id)
            .classed('completed', (d: any) => !!d.data?.metadata?.assignmentCompleted)
            .on('mousedown', (e: any, d: any) => {
                this.selectedNode$.next(d.data['id']);
                this.st.selected = d.data;
                const copy = new ProjectSerializerService().fromJson(d.data.data);
                this.dashboard.updateProject(copy, true);
                this.drawChart();
            });

        node.append('text')
            .text((d: any) => d.data['name'])
            .attr('x', (d: any) => d.x)
            .attr('dx', 8.5)
            .attr('y', (d: any) => d.y);
    }
}
