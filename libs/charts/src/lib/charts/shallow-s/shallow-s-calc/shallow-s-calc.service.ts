import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { subBusinessDays } from 'date-fns';
import { Point, ShallowSPoint, Stats } from '../../../models/shallow-s';
@Injectable({
    providedIn: 'root',
})
export class ShallowSCalcService {
    constructor() {}

    private getSortComparator(a?: Date, b?: Date): number {
        if (!a && !b) {
            return 0;
        }
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        return a.getTime() - b.getTime();
    }

    private calculateCompletionPercent(dataset: ShallowSPoint[]): void {
        const actual = dataset.filter(d => !!d.actual).sort((a, b) => this.getSortComparator(a.actual, b.actual));
        const pcd = dataset.filter(d => !!d.planned).sort((a, b) => this.getSortComparator(a.planned, b.planned));
        let total = dataset.reduce((a, c) => {
            if (c.duration) return a + c.duration;
            else return a;
        }, 0);
        pcd.reduce((accumulator, currentValue) => {
            const sum = accumulator + (currentValue.duration ?? 0);
            currentValue.percentPlannedFinished = Math.round((sum / total) * 100);
            return sum;
        }, 0);
        actual.reduce((accumulator, currentValue) => {
            const sum = accumulator + (currentValue.duration ?? 0);
            currentValue.percentActualFinished = Math.round((sum / total) * 100);
            return sum;
        }, 0);
    }

    public calculateShallowSSnapshotProps(dataset: ShallowSPoint[], proj: Project): Stats | null {
        const props = this.calculateShallowSProps(dataset, proj, true);
        if (!props) {
            return null;
        }
        const actualMax = Math.max(...props.data.filter(d => !!d.actual).map(d => (d.actual as Date).getTime()));
        const plannedMax = Math.max(...props.data.filter(d => !!d.planned).map(d => (d.planned as Date).getTime()));
        const snapShotXEnd = Math.max(...[actualMax, plannedMax].filter(x => !isNaN(x)));
        props.extents.x[1] = snapShotXEnd;
        return props;
    }
    // https://github.com/harrystevens/d3-regression/blob/master/src/linear.js
    public calculateShallowSProps(dataset: ShallowSPoint[], proj: Project, isSnapshot: boolean = false): Stats | null {
        if (!dataset.find(d => !!d.duration)) {
            return null;
        }
        this.calculateCompletionPercent(dataset);
        const allActual = dataset.filter(d => !!d.actual);
        const allPlanned = dataset.filter(d => !!d.planned);
        let startActual = Math.min(...allActual.map(d => d.actual.getTime()));
        let startPlanned = Math.min(...allPlanned.map(d => d.planned.getTime()));

        if (proj.profile.view.useStartDates) {
            startActual = Math.min(...allActual.map(d => subBusinessDays(d.actual, /*d.duration > 30 ? 30 :*/ d.duration).getTime()));
            startPlanned = Math.min(...allPlanned.map(d => subBusinessDays(d.planned, /*d.duration > 30 ? 30 :*/ d.duration).getTime()));
        }
        if (startActual === Infinity && startPlanned === Infinity) {
            return null;
        } else if (startActual === Infinity) {
            startActual = startPlanned;
        } else if (startPlanned === Infinity) {
            startPlanned = startActual;
        }
        const startPPt: ShallowSPoint = {
            duration: 0,
            planned: new Date(startPlanned),
            actual: null,
            name: 'Start Planned',
            percentActualFinished: 0,
            percentPlannedFinished: 0,
            isMilestone: false,
            id: -1,
        };
        const startAPt: ShallowSPoint = {
            duration: 0,
            planned: null,
            actual: new Date(startActual),
            name: 'Start Actual',
            percentActualFinished: 0,
            percentPlannedFinished: 0,
            isMilestone: false,
            id: -2,
        };

        const adjustedData = [startAPt, startPPt, ...dataset];

        const reg = this.lineRegSlope(dataset, startActual, startPlanned);
        const x100A = reg.slopeA !== 0 ? Math.round(100 / reg.slopeA) + startActual : null;
        const x100P = reg.slopeP !== 0 ? Math.round(100 / reg.slopeP) + startPlanned : null;
        const max100s = Math.max(x100A, x100P);

        const actualMax = Math.max(...adjustedData.filter(d => !!d.actual).map(d => d.actual.getTime()));
        const plannedMax = Math.max(...adjustedData.filter(d => !!d.planned).map(d => d.planned.getTime()));

        const xEnd = Math.max(...[x100A, x100P, actualMax, plannedMax].filter(x => !isNaN(x)));
        const minStart = Math.min(startActual, startPlanned);
        const xExtent = [minStart, xEnd] as [number, number];
        const yOverRunA = reg.slopeA ? Math.round(reg.slopeA * (max100s - startActual)) : null;
        const yOverRunP = reg.slopeP ? Math.round(reg.slopeP * (max100s - startPlanned)) : null;
        const maxOverrun = Math.max(yOverRunA, yOverRunP);

        if (!proj.profile.view.showOverrun || isSnapshot) {
            const actualReg = !isNaN(x100A)
                ? ([
                      { x: startActual, y: 0 },
                      { x: x100A, y: 100 },
                  ] as [Point, Point])
                : null;
            const plannedReg = !isNaN(x100P)
                ? ([
                      { x: startPlanned, y: 0 }, // TODO: use logistic regression with extreme numbers should the regression start at the planned date
                      { x: x100P, y: 100 },
                  ] as [Point, Point])
                : null;
            return {
                regression: {
                    actual: actualReg,
                    planned: plannedReg,
                },
                extents: {
                    x: xExtent,
                    y: [0, 100],
                },
                showOverRun: proj.profile.view.showOverrun,
                overRunPoints: null,
                data: adjustedData,
                step: proj.profile.view.showStepChart,
            } as Stats;
        }
        const overRunPoints: OverrRunPoints = {
            x: [
                [
                    { x: x100A, y: 0 },
                    { x: x100A, y: maxOverrun },
                ],
                [
                    { x: x100P, y: 0 },
                    { x: x100P, y: maxOverrun },
                ],
            ],
            y: [
                [
                    { x: minStart, y: yOverRunA },
                    { x: xEnd, y: yOverRunA },
                ],
                [
                    { x: minStart, y: yOverRunP },
                    { x: xEnd, y: yOverRunP },
                ],
            ],
        };
        const actualReg = !isNaN(max100s)
            ? [
                  { x: startActual, y: 0 },
                  { x: max100s, y: yOverRunA },
              ]
            : null;
        const plannedReg = !isNaN(max100s)
            ? [
                  { x: startPlanned, y: 0 }, // TODO: use logistic regression with extreme numbers should the regression start at the planned date
                  { x: max100s, y: yOverRunP },
              ]
            : null;
        return {
            regression: {
                actual: actualReg,
                planned: plannedReg,
            },
            extents: {
                x: xExtent,
                y: [0, (!isNaN(yOverRunA) && !!yOverRunA) || (!isNaN(yOverRunP) && !!yOverRunP) ? Math.max(yOverRunA, yOverRunP) : 100],
            },
            showOverRun: proj.profile.view.showOverrun,
            overRunPoints,
            data: adjustedData,
            step: proj.profile.view.showStepChart,
        } as Stats;
    }
    private lineRegSlope(dataset: ShallowSPoint[], startActual: number, startPlanned: number): LinearRegressions {
        const actualData = dataset.filter(x => !!x.actual);
        const plannedData = dataset.filter(x => !!x.planned);
        const numA = actualData.reduce((a, c) => {
            return a + c.percentActualFinished * (c.actual.getTime() - startActual);
        }, 0);
        const denomA = actualData.reduce((a, c) => {
            const offset = c.actual.getTime() - startActual;
            return a + offset * offset;
        }, 0);

        const numP = plannedData.reduce((a, c) => {
            return a + c.percentPlannedFinished * (c.planned.getTime() - startPlanned);
        }, 0);
        const denomP = plannedData.reduce((a, c) => {
            const offset = c.planned.getTime() - startPlanned;
            return a + offset * offset;
        }, 0);
        const slopeA = numA / denomA;
        const slopeP = numP / denomP;
        return { slopeA, slopeP };
    }
}
