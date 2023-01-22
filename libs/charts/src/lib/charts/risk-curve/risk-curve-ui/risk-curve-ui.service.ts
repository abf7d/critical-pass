import { Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { Project } from '../../../models/project/project';
import * as d3 from 'd3';
import { RiskCurveState, RiskCurveStateFactory } from '../risk-curve-state/risk-curve-state';
import { RiskCurveDecompressorService } from '../risk-curve-decompressor/risk-curve-decompressor.service';
// import { RiskOption } from '../../../models/charts/risk-curve';
import * as d3reg from 'd3-regression';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/models';
import { RiskMap, RiskOption, RiskPoint } from '../../../models/risk-option';
import * as CONST from '../../../constants/constants';
// import { ProjectManagerBase } from '../../../models';
// interface RiskPoint {
//     extraFloat;
//     risk;
// }
// interface RiskMap {
//     name;
//     values;
// }

@Injectable({
    providedIn: 'root',
})
export class RiskCurveUiService {
    private id!: number;
    public st!: RiskCurveState;
    private data!: Observable<Project>;
    private sub!: Subscription;
    private projIsEmpty!: BehaviorSubject<boolean>;
    private xScale: any;
    private yScale: any;
    private colorScale: any;
    private riskLineGen: any;
    private project!: Project;
    private decompressAmount$: BehaviorSubject<number>;
    private riskTypes!: RiskMap[];
    private riskLocator: d3.Bisector<any, any>;
    private riskOptions!: RiskOption[];
    private triggerSecondDerivative$: BehaviorSubject<boolean>;
    private riskCurveType$: BehaviorSubject<string>;
    private decompAmtSub: Subscription;
    private secDerivTriggerSub: Subscription;
    private curveTypeSub: Subscription;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private ngZone: NgZone,
        private decompressor: RiskCurveDecompressorService,
    ) {
        this.decompressAmount$ = this.eventService.get(CONST.DECOMPRESS_AMOUNT); //this.pManager.getChannel(Keys.decompressAmount);
        this.decompAmtSub = this.decompressAmount$.pipe(filter(x => !!x)).subscribe(riskVal => {
            this.decompressProject(riskVal);
        });
        this.triggerSecondDerivative$ = this.eventService.get(CONST.TRIGGER_SECOND_DERIVATIVE);
        this.secDerivTriggerSub = this.triggerSecondDerivative$.pipe(filter(x => !!x)).subscribe(_ => {
            this.setSecondDerivative();
        });

        this.riskLocator = d3.bisector(d => d);
        this.riskCurveType$ = this.eventService.get(CONST.RISK_CURVE_TYPE);
        this.curveTypeSub = this.riskCurveType$.pipe(filter(x => !!x && !!this.st)).subscribe(_ => {
            const decomAmtFromInput = this.decompressAmount$.getValue();
            if (decomAmtFromInput) {
                this.decompressProject(decomAmtFromInput);
            }
        });
    }

    public init(width: number, height: number, id: number, el: any) {
        this.id = id;
        this.st = new RiskCurveStateFactory().create();
        this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
        this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
        this.initSvg(width, height, el);
        this.data = this.dashboard.activeProject$;
        this.sub = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.project = project;
                this.createChart(project);
            });
        });
    }

    public destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.decompAmtSub) {
            this.decompAmtSub.unsubscribe();
        }
        if (this.curveTypeSub) {
            this.curveTypeSub.unsubscribe();
        }
        if (this.secDerivTriggerSub) {
            this.secDerivTriggerSub.unsubscribe();
        }
    }

    public setProjIsEmpty(isEmpty: BehaviorSubject<boolean>): void {
        this.projIsEmpty = isEmpty;
    }

    private initSvg(width: number, height: number, el: any): void {
        const svgclass = 'risk-curve-' + this.id;
        d3.select(el).select('svg').remove();
        const svg = d3.select(el).append('svg').attr('class', svgclass);
        this.st.svg = svg
            .style('width', '100%')
            .style('height', null)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .append('g');

        this.st.mainG = this.st.svg.append('g').attr('transform', `translate(${this.st.margin.left},${this.st.margin.top})`);
        this.xScale = d3.scaleLinear().range([0, this.st.innerWidth]);
        this.yScale = d3.scaleLinear().range([this.st.innerHeight, 0]);
        this.riskLineGen = d3
            .line<RiskPoint>()
            .x(d => this.xScale(d.extraFloat))
            .y(d => this.yScale(d.risk));
    }

    private createChart(project: Project): void {
        const isEmpty = project.integrations.length === 0;
        this.projIsEmpty.next(isEmpty);
        if (isEmpty) {
            return;
        }
        const riskData = this.decompressor.getRiskOptions(project);
        this.riskOptions = riskData;
        this.drawChart(riskData);
    }

    private drawChart(riskData: RiskOption[]): void {
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const keys = ['criticality', 'fibonacci', 'activity'];
        this.colorScale.domain(keys);
        const riskTypes = this.colorScale.domain().map((name: string) => {
            const values = riskData.map((d: any) => {
                return { extraFloat: d.extraFloat, risk: +d[name] } as RiskPoint;
            });
            return { name, values } as RiskMap;
        }) as RiskMap[];
        this.riskTypes = riskTypes;
        this.buildPolynomialRegression(riskData);
        this.xScale.domain(d3.extent(riskData, d => d.extraFloat));
        this.yScale.domain([0, 1]);

        this.initChartClip();
        const chartG = this.st.mainG.append('g').attr('class', 'top-chart');
        this.renderChart(riskTypes, chartG);
        const infoContainer = this.addMouseOverInfoElements();
        this.initMouseOverAndBrushEvents(infoContainer, riskData, riskTypes);
        this.initFrozenPoint(riskData);
    }

    private buildPolynomialRegression(data: RiskOption[]): void {
        const domain = undefined;
        const activity = d3reg
            .regressionPoly()
            .x((d: RiskOption) => d.extraFloat)
            .y((d: RiskOption) => d.activity)
            .order(3)
            .domain(domain);
        const fibonacci = d3reg
            .regressionPoly()
            .x((d: RiskOption) => d.extraFloat)
            .y((d: RiskOption) => d.fibonacci)
            .order(3)
            .domain(domain);
        const criticality = d3reg
            .regressionPoly()
            .x((d: RiskOption) => d.extraFloat)
            .y((d: RiskOption) => d.criticality)
            .order(3)
            .domain(domain);
        this.st.activityReg = activity(data);
        this.st.fibReg = fibonacci(data);
        this.st.criticalReg = criticality(data);
    }

    private initMouseOverAndBrushEvents(infoContainer: any, riskData: RiskOption[], riskTypes: RiskMap[]): void {
        const width = this.st.innerWidth;
        const height = this.st.innerHeight;
        this.st.mainG
            .append('rect')
            .attr('width', width + this.st.margin.left + this.st.margin.right)
            .attr('height', height + this.st.margin.top + this.st.margin.bottom)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', () => {
                infoContainer.style('display', null);
            })
            .on('mouseout', () => {
                if (!this.st.freeze) {
                    infoContainer.style('display', 'none');
                }
            })
            .on('mousemove', (event: any) => {
                const node = d3.select(event.currentTarget);
                const pos = d3.pointer(event, node.node())[0];
                this.mousemove(riskData, pos, riskTypes);
            })
            .on('mousedown', () => {
                this.mousedown();
                if (this.st.freeze) {
                    const point = riskData.find(x => x.extraFloat === this.st.frozenPoint);
                    if (point) {
                        const decompressAmt = this.getRiskValue(point);
                        this.decompressAmount$.next(decompressAmt);
                    }
                } else {
                    this.project.profile.risk.decompressAmount = 0;
                    this.dashboard.updateProject(this.project, true);
                }
            });
    }
    private mousedown(): void {
        this.st.freeze = !this.st.freeze;
        const focus = this.st.mainG.select('.info');
        if (this.st.freeze) {
            focus.select('circle.x').attr('style', 'fill: grey');
            focus.select('circle.y').attr('style', 'fill: grey');
            focus.select('circle.z').attr('style', 'fill: grey');
        } else {
            focus.select('circle.x').attr('style', 'fill: none');
            focus.select('circle.y').attr('style', 'fill: none');
            focus.select('circle.z').attr('style', 'fill: none');
        }
    }
    private mousemove(riskData: RiskOption[], xPos: number, riskTypes: RiskMap[]): void {
        if (this.st.freeze) {
            return;
        }
        const x0 = this.xScale.invert(xPos),
            i = this.st.bisectFloat(riskData, x0, 1),
            d0 = riskData[i - 1];
        let d1 = riskData[i];
        let d = null;
        if (d1 === undefined) {
            // bisect inserts a calc value into data array. If it is the last item, then index is .length + 1
            d1 = d0;
        }
        d = x0 - d0.extraFloat > d1.extraFloat - x0 ? d1 : d0;

        this.st.frozenPoint = d.extraFloat;
        d3.max(riskTypes, function (c: RiskMap) {
            return d3.max(c.values, function (v: RiskPoint) {
                return v.risk;
            });
        });
        this.updateMouseOverCircles(d);
    }

    private initChartClip(): void {
        const width = this.st.innerWidth;
        const height = this.st.innerHeight;
        this.st.mainG.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', width).attr('height', height);
    }

    private renderChart(riskTypes: RiskMap[], chartG: any): void {
        const risk = chartG.selectAll('.risk').data(riskTypes).enter().append('g').attr('class', 'risk');

        risk.append('path')
            .attr('class', 'line')
            .attr('d', (d: any) => this.riskLineGen(d.values))
            .style('stroke', (d: any) => this.colorScale(d.name))
            .attr('clip-path', 'url(#clip)');

        this.createAxes(chartG);

        risk.append('text')
            .datum((d: any) => {
                return { name: d.name, value: d.values[d.values.length - 1] };
            })
            .attr('transform', (d: any) => 'translate(' + this.xScale(d.value.extraFloat) + ',' + this.yScale(d.value.risk) + ')')
            .attr('x', 3)
            .attr('dy', '.35em')
            .text((d: RiskMap) => {
                return d.name;
            });

        riskTypes.forEach(r => {
            risk.append('g')
                .attr('class', 'circles')
                .selectAll('circle')
                .data(r.values)
                .enter()
                .append('circle')
                .attr('clip-path', 'url(#clip)')
                .attr('cx', (d: any) => this.xScale(d.extraFloat))
                .attr('cy', (d: any) => this.yScale(d.risk))
                .style('stroke', (d: any) => this.colorScale(r.name))
                .attr('r', 1);
        });

        this.renderRegressions(chartG);
        this.st.secondDerivativeZero = this.secondDerivativeZero();
        this.drawSecondDerivativeLine(chartG);

        this.st.bisectFloat = d3.bisector(function (d: RiskPoint) {
            return d.extraFloat;
        }).left;
        return risk;
    }
    private renderRegressions(chartG: any): void {
        this.renderRegLine(chartG, this.st.criticalReg, 'criticality');
        this.renderRegLine(chartG, this.st.activityReg, 'activity');
        this.renderRegLine(chartG, this.st.fibReg, 'fibonacci');
    }
    private initFrozenPoint(riskData: RiskOption[]): void {
        if (this.st.freeze === true && this.st.frozenPoint !== null) {
            const allRiskPoint = riskData.find(d => d.extraFloat === this.st.frozenPoint);
            this.updateMouseOverCircles(allRiskPoint, true);
            this.st.freeze = false;
            this.mousedown();
        }
    }

    private updateMouseOverCircles(d: any, wake = false): void {
        const infoContainer = this.st.mainG.select('.info');
        if (wake) {
            infoContainer.style('display', null);
        }
        infoContainer
            .select('circle.y')
            .style('stroke', this.colorScale('criticality'))
            .attr('transform', 'translate(' + this.xScale(d.extraFloat) + ',' + this.yScale(d.criticality) + ')');

        infoContainer
            .select('circle.x')
            .style('stroke', this.colorScale('activity'))
            .attr('transform', 'translate(' + this.xScale(d.extraFloat) + ',' + this.yScale(d.activity) + ')');

        infoContainer
            .select('circle.z')
            .style('stroke', this.colorScale('fibonacci'))
            .attr('transform', 'translate(' + this.xScale(d.extraFloat) + ',' + this.yScale(d.fibonacci) + ')');

        infoContainer
            .select('text.y')
            .style('stroke', this.colorScale('criticality'))
            .text('Criticality: ' + d.criticality)
            .attr('transform', 'translate(' + this.xScale(22) + ',' + this.yScale(1) + ')');

        infoContainer
            .select('text.x')
            .style('stroke', this.colorScale('activity'))
            .text('Activity: ' + d.activity)
            .attr('transform', 'translate(' + this.xScale(10) + ',' + this.yScale(1) + ')');
        infoContainer
            .select('text.z')
            .style('stroke', this.colorScale('fibonacci'))
            .text('Fibonacci: ' + d.fibonacci)
            .attr('transform', 'translate(' + this.xScale(36) + ',' + this.yScale(1) + ')');
        infoContainer
            .select('text.a')
            .style('stroke', '#555')
            .text('Days Decompressed: ' + d.extraFloat)
            .attr('transform', 'translate(' + this.xScale(50) + ',' + this.yScale(1) + ')');
    }

    private renderRegLine(chartG: any, riskData: any[], name: string): void {
        const mapped = riskData.map(d => {
            return { extraFloat: d[0], risk: d[1] };
        });
        const reg = chartG.append('g').attr('class', 'regression ' + name);

        reg.append('path')
            .attr('class', 'line')
            .attr('d', (d: any) => this.riskLineGen(mapped))
            .style('stroke', (d: any) => this.colorScale(name))
            .attr('clip-path', 'url(#clip)');
    }
    private secondDerivativeZero(): number {
        const coefficients = this.st.activityReg.coefficients;
        const firstCoef = coefficients[2] * 2;
        const secondCoef = coefficients[3] * 3 * 2;
        const answ = (-1 * firstCoef) / secondCoef;
        return answ;
    }

    private drawSecondDerivativeLine(chartG: any): void {
        const x = this.st.secondDerivativeZero;
        const coefficients = this.st.activityReg.coefficients;
        const y = coefficients[0] + coefficients[1] * x + coefficients[2] * x * x + coefficients[3] * Math.pow(x, 3); // +

        if (x) {
            const points = [
                { extraFloat: x, risk: y },
                { extraFloat: x, risk: 0 },
            ];
            chartG
                .append('path')
                .attr('class', 'regression sec-derivative')
                .attr('d', (d: any) => {
                    return this.riskLineGen(points);
                })
                .style('stroke', 'black')
                .attr('clip-path', 'url(#clip)');
        }
    }

    private addMouseOverInfoElements(): void {
        const info = this.st.mainG.append('g').attr('class', 'info').style('display', 'none');

        info.append('circle').attr('class', 'y').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        info.append('circle').attr('class', 'x').style('fill', 'none').style('stroke', 'blue').attr('r', 4);

        info.append('circle').attr('class', 'z').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        info.append('text').attr('class', 'y').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        info.append('text').attr('class', 'z').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        info.append('text').attr('class', 'x').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        info.append('text').attr('class', 'a').style('fill', 'none').style('stroke', 'blue').attr('r', 4);
        return info;
    }

    // TODO Fix x axis it is running of the chart
    private createAxes(chartG: any): void {
        const xAxis = d3.axisBottom(this.xScale);
        const yAxis = d3.axisLeft(this.yScale);
        const xaxisHeight = +this.st.innerHeight;
        chartG
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + xaxisHeight + ')')
            .call(xAxis)
            .append('text')
            .attr('x', this.st.innerWidth)
            .attr('y', -6)
            .attr('dx', '.71em')
            .style('text-anchor', 'end')
            .text('Days decompressed');

        // Add y axis
        chartG
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -42)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Risk');
    }

    private decompressProject(riskVal: number) {
        if (!!riskVal && this.riskTypes) {
            const selectedRisk = this.riskCurveType$.getValue();
            const riskObjs = this.riskTypes.find(x => x.name === selectedRisk)?.values.sort((a, b) => a.risk - b.risk);
            if (riskObjs) {
                const mappedRisk = riskObjs.map(d => d.risk);
                const index = this.riskLocator.left(mappedRisk, +riskVal);
                let decompressPercentage: number | null = null;
                if (index === mappedRisk.length) {
                    decompressPercentage = mappedRisk[mappedRisk.length - 1];
                } else if (index === 0) {
                    decompressPercentage = mappedRisk[index];
                } else if (riskVal - mappedRisk[index - 1] < mappedRisk[index] - riskVal) {
                    decompressPercentage = mappedRisk[index - 1];
                } else {
                    decompressPercentage = mappedRisk[index];
                }
                const point = riskObjs.find(c => c.risk === decompressPercentage);
                if (point) {
                    const allRiskPoint = this.riskOptions.find(d => d.extraFloat === point.extraFloat);
                    this.project.profile.risk.decompressAmount = point.extraFloat;

                    this.updateMouseOverCircles(allRiskPoint, true);

                    this.st.freeze = false;
                    this.mousedown();
                    this.st.frozenPoint = point.extraFloat;
                    this.dashboard.updateProject(this.project, true);
                }
            }
        }
    }
    private getRiskForDays(days: number, type: string): number {
        let coefficients;
        switch (type) {
            case CONST.ACTIVITY_RISK_KEY:
                coefficients = this.st.activityReg.coefficients;
                break;
            case CONST.CRITICALITY_RISK_KEY:
                coefficients = this.st.criticalReg.coefficients;
                break;
            case CONST.FIBONACCI_RISK_KEY:
                coefficients = this.st.fibReg.coefficients;
                break;
            default:
                coefficients = this.st.activityReg.coefficients;
                break;
        }
        return coefficients[0] + coefficients[1] * days + coefficients[2] * days * days + coefficients[3] * Math.pow(days, 3); // +
    }
    private setSecondDerivative() {
        this.st.secondDerivativeZero = this.secondDerivativeZero();
        let type = this.riskCurveType$.getValue();
        const y = this.getRiskForDays(this.st.secondDerivativeZero, type);
        this.decompressAmount$.next(+y.toFixed(3));
    }
    private getRiskValue(option: RiskOption) {
        let type = this.riskCurveType$.getValue();
        let value;
        switch (type) {
            case CONST.ACTIVITY_RISK_KEY:
                value = option.activity;
                break;
            case CONST.CRITICALITY_RISK_KEY:
                value = option.criticality;
                break;
            case CONST.FIBONACCI_RISK_KEY:
                value = option.fibonacci;
                break;
            default:
                value = option.activity;
                break;
        }
        return value;
    }
}
