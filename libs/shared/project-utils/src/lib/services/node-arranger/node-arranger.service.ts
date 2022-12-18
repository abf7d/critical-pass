import { Injectable } from '@angular/core';
import * as d3dag from 'd3-dag';
import { tr } from 'date-fns/locale';
import { Activity } from '../../../models/project/activity/activity';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';

@Injectable({
    providedIn: 'root',
})
export class NodeArrangerService {
    offset = 500;
    scaleFactor = 7;
    multiChartOffset = 0;
    multiChartscaleFactor = 3;

    constructor() {}

    public setXYLocations(node, project: Project, offset: number, scaleFactor: number) {
        const inode = project.integrations.find(i => i.id === +node.id);
        if (inode) {
            inode.x = node.y * (offset + project.activities.length * scaleFactor);
            inode.y = node.x * (offset + project.activities.length * scaleFactor);
        }
        node.children.forEach(c => {
            this.setXYLocations(c, project, offset, scaleFactor);
        });
    }

    public arrangeNodes(project: Project): void {
        const dagNodes = [];

        project.integrations.forEach(i => {
            const incomming = project.activities.filter(a => a.chartInfo.target_id === i.id).map(a => a.chartInfo.source_id);
            dagNodes.push({ id: i.id, parentIds: incomming });
        });
        const transform = this.connectWithFakeStart(project, dagNodes);

        const dag = d3dag.dagStratify()(dagNodes);
        const finalDag = d3dag.sugiyama().decross(d3dag.decrossTwoLayer().order(d3dag.twolayerOpt()))(dag);
        this.setXYLocations(finalDag, project, transform.offset, transform.scale);
        project.profile.view.autoZoom = true;
    }

    public connectWithFakeStart(project: Project, dagNodes: any[]): { scale: number; offset: number } {
        const starts = project.integrations.filter(x => {
            const incoming = project.activities.filter(y => y.chartInfo.target_id === x.id);
            return incoming.length === 0;
        });
        if (starts.length > 1) {
            dagNodes.push({ id: -10000, parentIds: [] });
            starts.forEach((x, i) => {
                const node = dagNodes.find(y => y.id === x.id);
                if (node) {
                    dagNodes.splice(dagNodes.indexOf(node), 1);
                }
                dagNodes.push({ id: x.id, parentIds: [-10000] });
                return { scale: this.multiChartscaleFactor, offset: this.multiChartOffset };
            });
        }
        return { scale: this.scaleFactor, offset: this.offset };
    }
}
