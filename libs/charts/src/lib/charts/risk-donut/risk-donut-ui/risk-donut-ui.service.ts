import { Inject, Injectable, NgZone } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as d3 from 'd3';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/types';
import * as CONST from '../../../constants/constants';

@Injectable()
export class RiskDonutUiService {
    private id!: number;
    private data!: Observable<Project>;
    private sub!: Subscription;
    private svg: any;
    private arcG: any;
    private labelG: any;
    private radius!: number;
    private innerRadius!: number;
    private arc: any;
    private width!: number;
    private height!: number;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, private ngZone: NgZone) {}

    public init(width: number, height: number, id: number, el: any) {
        this.id = id;
        this.radius = 0.29 * width;
        this.innerRadius = 0.14 * height;
        this.width = width;
        this.height = height;
        this.initSvg(width, height, el);
        this.data = this.dashboard.activeProject$;
        this.sub = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.createChart(project);
            });
        });
    }

    public destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {any} el
     * @returns void
     */
    public initSvg(width: number, height: number, el: any): void {
        const svgclass = 'risk-donut-' + this.id;
        d3.select(el).select('svg').remove();
        const svg = d3.select(el).append('svg').attr('class', svgclass);
        svg.style('width', '100%').style('height', null).attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${width} ${height}`);
        this.svg = svg.append('g');
        this.arcG = this.svg
            .append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        this.labelG = this.svg
            .append('g')
            .attr('class', 'label_group')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        this.svg
            .append('g')
            .attr('class', 'center_group')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    }

    private percentRisk(risk: number, total: number, proj: Project): number {
        return (
            (proj.activities.filter(a => a.chartInfo.risk === risk && a.chartInfo.tf !== Infinity && a.chartInfo.tf !== null && !a.chartInfo.isDummy).length *
                100) /
            total
        );
    }

    private percentUnprocessed(risk: number, total: number, proj: Project): number {
        return (proj.activities.filter(a => (a.chartInfo.tf === Infinity || a.chartInfo.tf === null) && !a.chartInfo.isDummy).length * 100) / total;
    }

    private calcPieData(proj: Project): RiskArc[] {
        const total = proj.activities.filter(x => !x.chartInfo.isDummy).length;
        return [
            {
                name: 'Low',
                percent: this.percentRisk(CONST.RISK_CODE.LOW, total, proj),
                color: CONST.DONUT_COLOR.LOW,
            },
            {
                name: 'Medium',
                percent: this.percentRisk(CONST.RISK_CODE.MEDIUM, total, proj),
                color: CONST.DONUT_COLOR.MEDIUM,
            },
            {
                name: 'High',
                percent: this.percentRisk(CONST.RISK_CODE.HIGH, total, proj),
                color: CONST.DONUT_COLOR.HIGH,
            },
            {
                name: 'Critical',
                percent: this.percentRisk(CONST.RISK_CODE.CRITICAL, total, proj),
                color: CONST.DONUT_COLOR.CRITICAL,
            },
            {
                name: 'Unprocessed',
                percent: this.percentUnprocessed(CONST.RISK_CODE.CRITICAL, total, proj),
                color: CONST.DONUT_COLOR.UNPROCESSED,
            },
        ];
    }
    private textOffset = 24;
    public createChart(project: Project): void {
        const isEmpty = project.integrations.length === 0;

        const data = this.calcPieData(project);

        const pie = d3
            .pie<RiskArc>()
            .value(d => d.percent)
            .sort(null);

        this.arc = d3.arc().innerRadius(this.radius).outerRadius(this.innerRadius);

        let path = this.arcG.selectAll('path');

        const data0 = path.data();
        const data1 = pie(data);
        const filteredPieData = data1.filter(x => x.data.percent > 0);

        path = path.data(data1, this.key);

        path.exit()
            .datum((d: any, i: any) => this.findNeighborArc(i, data1, data0, this.key) || d)
            .transition()
            .duration(750)
            .attrTween('d', arcTween)
            .remove();

        path.transition().duration(750).attrTween('d', arcTween);

        const _this = this;
        path.enter()
            .append('path')
            .each(function (d: any, i: any) {
                // @ts-ignore
                this._current = _this.findNeighborArc(i, data0, data1, this.key) || d;
            })
            .attr('fill', (d: any) => d.data.color)
            .transition()
            .duration(750)
            .attrTween('d', arcTween);

        function arcTween(d: any) {
            // @ts-ignore
            const i = d3.interpolate(this._current, d);
            // @ts-ignore
            this._current = i(1);
            return function (t: any) {
                return _this.arc(i(t));
            };
        }
        this.drawTickMarks(filteredPieData);
        this.drawCenterText(project, isEmpty);
        this.drawPercentageText(filteredPieData);
        this.drawRiskLabel(filteredPieData);
    }

    private drawTickMarks(data: any): void {
        const linesData = this.labelG.selectAll('line').data(data, this.key);
        linesData.exit().remove();
        linesData
            .enter()
            .append('line')
            .attr('x2', 0)
            .attr('y1', -this.radius - 3)
            .attr('y2', -this.radius - 15)
            .attr('stroke', 'gray')
            .attr('transform', (d: any) => {
                return 'rotate(' + ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI) + ')';
            });

        linesData
            .attr('x1', 0)
            .transition()
            .duration(750)
            .attr('x2', 0)
            .attr('y1', -this.radius - 3)
            .attr('y2', -this.radius - 15)
            .attr('stroke', 'gray')
            .attr('transform', (d: any) => {
                return 'rotate(' + ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI) + ')';
            });
    }

    private drawCenterText(proj: Project, isEmpty: boolean): void {
        this.labelG.select('g.center').remove('*');
        if (!isEmpty) {
            const group = this.labelG.append('g').attr('class', 'center');
            this.svg.selectAll('g.missing-data').remove();
            if (proj.profile.risk.criticalityRisk) {
                group.append('text').attr('class', 'center').text('Criticality').attr('x', -30).attr('y', -12).attr('class', 'crit-label');
                group
                    .append('text')
                    .attr('class', 'center')
                    .text(proj.profile.risk.criticalityRisk.toFixed(2))
                    .attr('x', -23)
                    .attr('y', 8)
                    .attr('class', 'criticality');
            }
        } else {
            let message = 'No data exists for Risk Donut';
            this.svg.attr('transform', null);
            this.svg
                .append('g')
                .attr('class', 'missing-data')
                .append('text')
                .attr('y', this.height / 3)
                .attr('x', this.width / 2 + 80)
                .style('text-anchor', 'end')
                .text(message);
            return;
        }
    }
    private drawPercentageText(data: any): void {
        const valueLabelsData = this.labelG.selectAll('text.value').data(data, this.key);
        valueLabelsData.exit().remove();
        valueLabelsData
            .enter()
            .append('text')
            .attr('class', 'value')
            .attr('transform', (d: any) => {
                return `translate(${Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset)},${
                    Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset)
                })`;
            })
            .attr('dy', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 5;
                } else {
                    return -7;
                }
            })
            .attr('text-anchor', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return 'beginning';
                } else {
                    return 'end';
                }
            })
            .text((d: any) => d.data.percent.toFixed(1) + '%');

        valueLabelsData
            .transition()
            .duration(750)
            .attr('transform', (d: any) => {
                return `translate(${Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset)},${
                    Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset)
                })`;
            })
            .attr('dy', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 5;
                } else {
                    return -7;
                }
            })
            .attr('text-anchor', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return 'beginning';
                } else {
                    return 'end';
                }
            })
            .text((d: any) => d.data.percent.toFixed(1) + '%');
    }
    private drawRiskLabel(data: any): void {
        const nameLabelsData = this.labelG.selectAll('text.units').data(data, this.key);
        nameLabelsData.exit().remove();
        nameLabelsData
            .enter()
            .append('text')
            .attr('class', 'units')
            .attr('transform', (d: any) => {
                return (
                    'translate(' +
                    Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) +
                    ',' +
                    Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) +
                    ')'
                );
            })
            .attr('dy', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 17;
                } else {
                    return 5;
                }
            })
            .attr('text-anchor', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return 'beginning';
                } else {
                    return 'end';
                }
            })
            .text((d: any) => {
                return d.data.name;
            });

        nameLabelsData
            .transition()
            .duration(750)
            .attr('transform', (d: any) => {
                return (
                    'translate(' +
                    Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) +
                    ',' +
                    Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) +
                    ')'
                );
            })
            .attr('dy', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 17;
                } else {
                    return 5;
                }
            })
            .attr('text-anchor', (d: any) => {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return 'beginning';
                } else {
                    return 'end';
                }
            })
            .text((d: any) => {
                return d.data.name;
            });
    }

    private key(d: any) {
        return d.data.name;
    }

    private findNeighborArc(i: any, data0: any, data1: any, key: any) {
        let d;
        return (d = this.findPreceding(i, data0, data1, key))
            ? { startAngle: d.endAngle, endAngle: d.endAngle }
            : (d = this.findFollowing(i, data0, data1, key))
            ? { startAngle: d.startAngle, endAngle: d.startAngle }
            : null;
    }

    // Find the element in data0 that joins the highest preceding element in data1.
    private findPreceding(i: any, data0: any, data1: any, key: any) {
        const m = data0.length;
        while (--i >= 0) {
            const k = this.key(data1[i]);
            for (let j = 0; j < m; ++j) {
                if (this.key(data0[j]) === k) return data0[j];
            }
        }
    }

    // Find the element in data0 that joins the lowest following element in data1.
    private findFollowing(i: any, data0: any, data1: any, key: any) {
        const n = data1.length,
            m = data0.length;
        while (++i < n) {
            const k = this.key(data1[i]);
            for (let j = 0; j < m; ++j) {
                if (this.key(data0[j]) === k) return data0[j];
            }
        }
    }
}

export interface RiskArc {
    name: string;
    percent: number;
    color: string;
}
