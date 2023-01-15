import { Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ShallowSState, ShallowSStateFactory } from '../shallow-s-state/shallow-s-state';
import { filter } from 'rxjs/operators';
import * as d3 from 'd3';
import { ShallowSCalcService } from '../shallow-s-calc/shallow-s-calc.service';
import { lightFormat } from 'date-fns';
// @ts-ignore
import * as d3reg from 'd3-regression';
import * as CONST from '../../../constants/keys';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/models';
import { ShallowSPoint, Stats } from '../../../models/shallow-s';

@Injectable()
export class ShallowSUiService {
    private id!: number;
    public st!: ShallowSState;
    private data!: Observable<Project>;
    private sub!: Subscription;
    private projIsEmpty!: BehaviorSubject<boolean>;
    private isDateSelected!: boolean;
    private regType!: string;
    private project!: Project;
    private subRegType: Subscription;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private ngZone: NgZone,
        private calc: ShallowSCalcService,
    ) {
        this.subRegType = this.eventService
            .get<string>(CONST.SHALLOW_S_REGRESSION_TYPE_KEY)
            .pipe(filter(x => !!x))
            .subscribe(regType => {
                this.regType = regType;
                if (this.project) {
                    this.createChart(this.project);
                }
            });
    }

    public init(width: number, height: number, id: number, el: any) {
        this.id = id;
        this.st = new ShallowSStateFactory().create();
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
        if (this.subRegType) {
            this.subRegType.unsubscribe();
        }
    }

    public setProjIsEmpty(isEmpty: BehaviorSubject<boolean>) {
        this.projIsEmpty = isEmpty;
    }

    public initSvg(width: number, height: number, el: any): void {
        const st = this.st;
        const svgclass = 'shallow-s-' + this.id;
        d3.select(el).select('svg').remove();
        const svg = d3.select(el).append('svg').attr('class', svgclass);
        this.st.svg = svg.style('width', '100%').style('height', null).attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${width} ${height}`);
        st.mainG = st.svg.append('g').attr('transform', 'translate(' + this.st.margin.left + ',' + this.st.margin.top + ')');

        st.svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', this.st.innerWidth).attr('height', this.st.innerHeight);
    }

    public createChart(proj: Project): void {
        const isEmpty = proj.integrations.length === 0;
        this.projIsEmpty.next(isEmpty);
        if (isEmpty) {
            return;
        }
        this.st.mainG.selectAll('*').remove();
        const dataset = this.getDataset(proj);
        const props = this.calc.calculateShallowSProps(dataset, proj);
        if (!props) {
            return;
        }
        this.drawChart(props);
    }

    private drawChart(props: Stats): void {
        const xScale = d3.scaleTime().range([0, this.st.innerWidth!]).domain(props.extents.x);
        const yScale = d3.scaleLinear().range([this.st.innerHeight!, 0]).domain(props.extents.y);
        this.drawAxes(xScale, yScale);
        this.drawLines(props, xScale, yScale);
        this.drawPoints(props, xScale, yScale);
        this.initFocusLineAndText(props, xScale, yScale);
        this.wireUpOverlay(props, xScale, yScale);
    }

    private getDataset(proj: Project): ShallowSPoint[] {
        return proj.activities
            .filter(a => !a.chartInfo.isDummy)
            .map(a => {
                return {
                    id: a.profile.id,
                    actual: a.profile.finish_dt,
                    planned: a.profile.planned_completion_date_dt,
                    name: a.profile.name,
                    duration: a.profile.duration,
                    percentActualFinished: null,
                    percentPlannedFinished: null,
                    isMilestone: !!a.chartInfo.milestoneNodeId,
                } as ShallowSPoint;
            });
    }

    private mouseClick(): void {
        this.isDateSelected = !this.isDateSelected;
        if (!this.isDateSelected) {
            this.st.focusLine.select('circle.click-circle').style('fill', null);
        }
        if (this.isDateSelected) {
            this.st.focusLine.select('circle.click-circle').style('fill', '#999');
        }
    }
    private focusMouseOver(event: any) {
        this.st.focusLine.style('display', null);
        d3.select(event.currentTarget).style('fill', '#ccc');
    }
    private focusMouseOut(event: any) {
        this.st.focusLine.style('display', null);
        if (!this.isDateSelected) {
            d3.select(event.currentTarget).style('fill', 'white');
        }
        if (this.isDateSelected) {
            d3.select(event.currentTarget).style('fill', '#999');
        }
    }
    private wireUpOverlay(props: Stats, xScale: any, yScale: any): void {
        const focus = this.st.focusLine;
        this.st.mainG
            .append('rect')
            .attr('class', 'overlay')
            .attr('width', this.st.innerWidth)
            .attr('height', this.st.innerHeight)
            .on('mouseover', () => focus.style('display', null))
            .on('mouseout', () => (!this.isDateSelected ? focus.style('display', 'none') : null))
            .on('mousemove', (event: any) => this.mouseMove(event, props, xScale, yScale))
            .on('click', (event: any) => this.mouseClick());

        focus
            .append('circle')
            .attr('class', 'click-circle')
            .style('fill', null)
            .style('stroke', 'black')
            .style('cursor', 'pointer')
            .attr('r', 6)
            .on('mouseover', (event: any) => this.focusMouseOver(event))
            .on('mouseout', (event: any) => this.focusMouseOut(event));
    }

    private initFocusLineAndText(props: Stats, xScale: any, yScale: any) {
        const focusLine = this.st.mainG.append('g').attr('class', 'focus').style('display', 'none');
        // Display on the timeline
        focusLine
            .append('line')
            .attr('class', 'y')
            .attr('x1', xScale(props.extents.x[0]) - 6)
            .attr('x2', xScale(props.extents.x[0]) + 6);

        // Display on the left bar
        focusLine
            .append('line')
            .attr('class', 'x0')
            .attr('y1', this.st.innerHeight! * 2 - 6)
            .attr('y2', this.st.innerHeight! + 6);

        focusLine.append('text').attr('class', 'x0');
        this.st.focusLine = focusLine;
    }

    private drawAxes(xScale: any, yScale: any) {
        const formatDate = d3.timeFormat('%-m/%-d/%-Y') as any;

        const xAxis = d3.axisBottom(xScale).tickFormat(formatDate);
        const yAxis = d3.axisLeft(yScale);
        this.st.mainG
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.st.innerHeight + ')')
            .call(xAxis);

        this.st.mainG
            .append('g')
            .attr('class', 'y axis axisLeft')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('% Completion');
    }

    private drawPoints(props: Stats, xScale: any, yScale: any): void {
        const planned = props.data.filter(d => !!d.planned);
        const actual = props.data.filter(d => !!d.actual);
        if (planned.length > 1) {
            this.st.mainG
                .append('g')
                .attr('class', 'circles')
                .selectAll('circle')
                .data(planned)
                .enter()
                .append('circle')
                .attr('clip-path', 'url(#clip)')
                .attr('cx', (d: ShallowSPoint) => {
                    const x = xScale(d.planned);
                    return x;
                })
                .attr('cy', (d: ShallowSPoint) => yScale(d.percentPlannedFinished))
                .attr('class', 'planned coord')
                .attr('r', 2);
        }
        if (actual.length > 1) {
            this.st.mainG
                .append('g')
                .attr('class', 'rects')
                .selectAll('rect')

                .data(actual)
                .enter()
                .append('rect')
                .attr('clip-path', 'url(#clip)')
                .attr('x', (d: ShallowSPoint) => xScale(d.actual) - 1)
                .attr('y', (d: ShallowSPoint) => yScale(d.percentActualFinished) - 1)
                .attr('height', 4) // set the height
                .attr('width', 4) // set the width
                .attr('class', 'actual coord');
        }
    }
    private drawLinearRegressions(props: Stats, plannedLine: any, actualLine: any): void {
        if (props.regression.actual) {
            const actual1: ShallowSPoint = {
                actual: new Date(props.regression.actual[0].x),
                percentActualFinished: props.regression.actual[0].y,
                percentPlannedFinished: null,
            };
            const actual2: ShallowSPoint = {
                actual: new Date(props.regression.actual[1].x),
                percentActualFinished: props.regression.actual[1].y,
                percentPlannedFinished: null,
            };
            const actualData = [actual1, actual2];
            this.st.mainG
                .append('path')
                .datum(actualData)
                .attr('clip-path', 'url(#clip)')
                .attr('class', 'regression actual')
                .attr('d', actualLine.curve(d3.curveLinear));
        }
        if (props.regression.planned) {
            const planned1: ShallowSPoint = {
                planned: new Date(props.regression.planned[0].x),
                percentPlannedFinished: props.regression.planned[0].y,
                percentActualFinished: null,
            };
            const planned2: ShallowSPoint = {
                planned: new Date(props.regression.planned[1].x),
                percentPlannedFinished: props.regression.planned[1].y,
                percentActualFinished: null,
            };

            const plannedData = [planned1, planned2];
            this.st.mainG
                .append('path')
                .datum(plannedData)
                .attr('clip-path', 'url(#clip)')
                .attr('class', 'regression planned')
                .attr('d', plannedLine.curve(d3.curveLinear));
        }
    }

    private drawOverrunLines(props: Stats, plannedLine: any, actualLine: any): void {
        if (!props.overRunPoints || !props.regression.actual || !props.regression.planned) {
            return;
        }
        const actualx1: ShallowSPoint = {
            actual: new Date(props.overRunPoints.x[0][0].x),
            percentActualFinished: props.overRunPoints.x[0][0].y,
            percentPlannedFinished: null,
        };
        const actualx2: ShallowSPoint = {
            actual: new Date(props.overRunPoints.x[0][1].x),
            percentActualFinished: props.overRunPoints.x[0][1].y,
            percentPlannedFinished: null,
        };
        const plannedx1: ShallowSPoint = {
            planned: new Date(props.overRunPoints.x[1][0].x),
            percentPlannedFinished: props.overRunPoints.x[1][0].y,
            percentActualFinished: null,
        };
        const plannedx2: ShallowSPoint = {
            planned: new Date(props.overRunPoints.x[1][1].x),
            percentPlannedFinished: props.overRunPoints.x[1][1].y,
            percentActualFinished: null,
        };

        const actualy1: ShallowSPoint = {
            actual: new Date(props.overRunPoints.y[0][0].x),
            percentActualFinished: props.overRunPoints.y[0][0].y,
            percentPlannedFinished: null,
        };
        const actualy2: ShallowSPoint = {
            actual: new Date(props.overRunPoints.y[0][1].x),
            percentActualFinished: props.overRunPoints.y[0][1].y,
            percentPlannedFinished: null,
        };
        const plannedy1: ShallowSPoint = {
            planned: new Date(props.overRunPoints.y[1][0].x),
            percentPlannedFinished: props.overRunPoints.y[1][0].y,
            percentActualFinished: null,
        };
        const plannedy2: ShallowSPoint = {
            planned: new Date(props.overRunPoints.y[1][1].x),
            percentPlannedFinished: props.overRunPoints.y[1][1].y,
            percentActualFinished: null,
        };

        const actualDatax = [actualx1, actualx2];
        const plannedDatax = [plannedx1, plannedx2];
        const actualDatay = [actualy1, actualy2];
        const plannedDatay = [plannedy1, plannedy2];

        this.st.mainG.append('path').datum(plannedDatax).attr('clip-path', 'url(#clip)').attr('class', 'planned regression').attr('d', plannedLine);
        this.st.mainG.append('path').datum(actualDatax).attr('clip-path', 'url(#clip)').attr('class', 'actual regression').attr('d', actualLine);
        this.st.mainG.append('path').datum(plannedDatay).attr('clip-path', 'url(#clip)').attr('class', 'planned regression').attr('d', plannedLine);
        this.st.mainG.append('path').datum(actualDatay).attr('clip-path', 'url(#clip)').attr('class', 'actual regression').attr('d', actualLine);
    }

    private drawOverrunElements(props: Stats, xScale: any, yScale: any): void {
        if (!props.overRunPoints || !props.regression.actual || !props.regression.planned) {
            return;
        }
        const actualx = props.overRunPoints.x[0][0].x;
        const plannedx = props.overRunPoints.x[1][0].x;
        const maxY = props.overRunPoints.x[0][1].y;
        const diffDays = Math.ceil(Math.abs((plannedx - actualx) / (1000 * 3600 * 24)));
        const leftCoord = Math.min(plannedx, actualx);
        this.st.mainG
            .append('rect')
            .attr('clip-path', 'url(#clip)')
            .attr('x', (d: any) => xScale(leftCoord) - 1)
            .attr('y', (d: any) => yScale(maxY) - 1)
            .attr('height', (d: any) => yScale(0))
            .attr('width', (d: any) => {
                xScale();
                const pixelwidth = xScale(actualx) - xScale(plannedx);
                return Math.abs(pixelwidth);
            })
            .attr('class', () => {
                return actualx > plannedx ? 'overrun over square' : 'overrun under square';
            });

        const actualy = props.overRunPoints.y[0][0].y;
        const plannedy = props.overRunPoints.y[1][0].y;
        const maxX = Math.max(plannedx, actualx);
        const minX = Math.min(props.regression.actual[0].x, props.regression.planned[0].x);
        const diffEffort = plannedy - actualy;
        this.st.mainG
            .append('rect')

            .attr('clip-path', 'url(#clip)')
            .attr('x', (d: any) => xScale(minX))
            .attr('y', (d: any) => yScale(maxY))
            .attr('height', (d: any) => {
                return yScale(100) - yScale(maxY);
            })
            .attr('width', (d: any) => {
                const pixelwidth = xScale(maxX) - xScale(minX);
                return Math.abs(pixelwidth);
            })
            .attr('class', () => {
                return actualx > plannedx ? 'overrun over square' : 'overrun under square';
            });
        this.drawOverrunText(diffDays, diffEffort);
    }

    private drawOverrunText(timeOverrun: number, budgetOverrun: number): void {
        this.st.mainG
            .append('text')
            .attr('class', 'b-overrun')
            .attr('y', 30)
            .attr('x', 30)
            .style('font-size', '13px')
            .style('stroke', 'white')
            .style('paint-order', 'stroke')
            .style('stroke-width', 6)
            .style('stroke-opacity', 0.7)
            .text('Budget Overrun: ' + budgetOverrun.toFixed(2) + ' %');

        this.st.mainG
            .insert('text', 'text.b-overrun')
            .attr('class', 's-overrun')
            .attr('y', 50)
            .attr('x', 30)
            .style('font-size', '13px')
            .style('stroke', 'white')
            .style('paint-order', 'stroke')
            .style('stroke-width', 6)
            .style('stroke-opacity', 0.7)
            .text('Schedule Overrun: ' + timeOverrun + ' Days');
    }

    private drawLines(props: Stats, xScale: any, yScale: any): void {
        const curve = props.step ? d3.curveStepAfter : d3.curveLinear;
        var plannedLine = d3
            .line<ShallowSPoint>()
            .x(d => xScale(d.planned))
            .y(d => yScale(d.percentPlannedFinished))
            .curve(curve);
        var actualLine = d3
            .line<ShallowSPoint>()
            .x(d => xScale(d.actual))
            .y(d => yScale(d.percentActualFinished))
            .curve(curve);

        const plannedSorted = props.data.filter(x => !!x.planned).sort((a, b) => a.planned!.getTime() - b.planned!.getTime());
        const actualSorted = props.data.filter(x => !!x.actual).sort((a, b) => a.actual!.getTime() - b.actual!.getTime());
        if (plannedSorted?.length > 1) {
            this.st.mainG.append('path').datum(plannedSorted).attr('clip-path', 'url(#clip)').attr('class', 'line planned').attr('d', plannedLine);
        }
        if (actualSorted?.length > 1) {
            this.st.mainG.append('path').datum(actualSorted).attr('clip-path', 'url(#clip)').attr('class', 'line actual').attr('d', actualLine);
        }
        if (!this.regType || this.regType === CONST.LINEAR_REG_TYPE) {
            this.drawLinearRegressions(props, plannedLine, actualLine);
        }
        if (this.regType == CONST.POLYNOMIAL_REG_TYPE) {
            this.drawPolynomialRegressions(props, plannedLine, actualLine);
        }
        this.drawOverrunLines(props, plannedLine, actualLine);
        this.drawOverrunElements(props, xScale, yScale);
    }

    private mouseMove(event: any, props: Stats, xScale: any, yScale: any): void {
        if (this.isDateSelected) {
            return;
        }
        const planned = props.data.filter(d => !!d.planned).sort((a, b) => a.planned!.getTime() - b.planned!.getTime());
        const bisectDate = d3.bisector((d: ShallowSPoint) => {
            return d.planned!.getTime();
        }).right;
        const formatPlanned = (d: ShallowSPoint) => lightFormat(d.planned!, CONST.SHALLOW_S_FORMAT) + ' - ' + d.name;
        const formatActual = (d: ShallowSPoint) => lightFormat(d.planned!, CONST.SHALLOW_S_FORMAT) + ' - ' + d.name;
        if (this.isDateSelected) {
            return;
        }
        const node = d3.select(event.currentTarget);
        const pos = d3.pointer(event, node.node())[0] + 10;

        // Get the closest activity to the mouseover
        const mouseDate = xScale.invert(pos);
        const closestIndex = bisectDate(planned, mouseDate, 1);
        const closestPt = planned[closestIndex - 1];

        // Get all planned and actual Activities that line up with the closest activity date
        const common = planned.filter(p => p.planned === closestPt.planned);

        // Move mouseover and click circle. Also print all of the dates on the vertical line
        // focus is the svg element that contains all of these mouseover elements
        const xLoc = xScale(closestPt.planned);
        const yLoc = yScale(closestPt.percentPlannedFinished);

        this.st.focusLine.select('circle.x0').attr('transform', `translate(${xLoc},${yLoc})`);
        this.st.focusLine.select('circle.click-circle').attr('transform', `translate(${xLoc},${yLoc})`);
        const textPlanned = this.st.focusLine.selectAll('text.planned-marker').data(common, (d: ShallowSPoint) => d.id);
        textPlanned.exit().remove();
        textPlanned
            .enter()
            .append('text')
            .attr('transform', (a: any, i: number) => {
                const textY = this.st.innerHeight! - 30 * (i + 1);
                const textX = xScale(closestPt.planned);
                return `translate(${textX},${textY})`;
            })
            .text((a: ShallowSPoint) => formatPlanned(a))
            .attr('class', 'planned-marker');
        const actuals = common.filter(p => !!p.actual);

        // Clear out all of the actual lines text and circles for a refresh before they are drawn again
        const lines = this.st.focusLine.selectAll('line.actual-marker').data(actuals, (d: ShallowSPoint) => d.id);
        const textActual = this.st.focusLine.selectAll('text.actual-marker').data(actuals, (d: ShallowSPoint) => d.id);
        const circle = this.st.focusLine.selectAll('circle.actual-marker').data(actuals, (d: ShallowSPoint) => d.id);

        textActual.exit().remove();
        textActual
            .enter()
            .append('text')
            .attr('transform', (a: any, index: number) => {
                const textY = this.st.innerHeight! - 30 * (index + 1) - 15;
                const textX = xScale(closestPt.actual);
                return `translate(${textX},${textY})`;
            })
            .text((a: ShallowSPoint) => formatActual(a))
            .attr('class', 'actual-marker');

        lines.exit().remove();
        lines
            .enter()
            .append('line')
            .attr('x1', (a: ShallowSPoint) => xScale(a.actual))
            .attr('x2', (a: ShallowSPoint) => xScale(a.actual))
            .attr('y1', this.st.innerHeight)
            .attr('y2', (a: ShallowSPoint) => yScale(a.percentActualFinished))
            .attr('class', 'actual-marker');

        circle.exit().remove();
        circle
            .enter()
            .append('circle')
            .attr('transform', (a: ShallowSPoint) => `translate(${xScale(a.actual)},${yScale(a.percentActualFinished)})`)
            .attr('r', 6)
            .attr('class', 'actual-marker');

        //TODO: make this transform and clip it to reduce the number of dome manipulations
        this.st.focusLine
            .select('.x0')
            .attr('x1', xScale(closestPt.planned))
            .attr('x2', xScale(closestPt.planned))
            .attr('y1', yScale(0))
            .attr('y2', yScale(closestPt.percentPlannedFinished));
    }

    private drawPolynomialRegressions(props: Stats, plannedLineGen: any, actualLineGen: any): void {
        const domain = undefined;
        const actual = props.data.filter(x => !!x.actual);
        const planned = props.data.filter(x => !!x.planned);
        const actualRegDef = d3reg
            .regressionPoly()
            .x((d: ShallowSPoint) => d.percentActualFinished)
            .y((d: ShallowSPoint) => d.actual)
            .order(3)
            .domain(domain);
        const plannedRegDef = d3reg
            .regressionPoly()
            .x((d: ShallowSPoint) => d.percentPlannedFinished)
            .y((d: ShallowSPoint) => d.planned)
            .order(3)
            .domain(domain);

        if (actual.length > 2) {
            const actualRegData = actualRegDef(actual);
            const aYVals = Array.from({ length: 21 }, (_, i) => 5 * i);

            const aPoints = aYVals.map(a => {
                return { percentActualFinished: a, actual: actualRegData.predict(a) };
            });

            this.st.mainG
                .append('path')
                .attr('class', 'line actual regression polynomial')
                .attr('d', (_: any) => actualLineGen(aPoints))
                .attr('clip-path', 'url(#clip)');
        }
        if (planned.length > 2) {
            const plannedRegData = plannedRegDef(planned);
            const pYVals = Array.from({ length: 21 }, (_, i) => 5 * i);
            const pPoints = pYVals.map(p => {
                return { percentPlannedFinished: p, planned: plannedRegData.predict(p) };
            });
            this.st.mainG
                .append('path')
                .attr('class', 'line planned regression polynomial')
                .attr('d', (_: any) => plannedLineGen(pPoints))
                .attr('clip-path', 'url(#clip)');
        }
    }
}
