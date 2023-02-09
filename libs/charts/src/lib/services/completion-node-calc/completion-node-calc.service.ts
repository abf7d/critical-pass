import { Injectable } from '@angular/core';
import { TreeNode } from '@critical-pass/project/types';
@Injectable({
    providedIn: 'root',
})
export class CompletionNodeCalcService {
    constructor() {}

    public getCompletedNodes(historyArray: TreeNode[]): TreeNode[] {
        const completed = historyArray.filter(node => {
            const nonDummies = node.data!.activities.filter(x => !x.chartInfo.isDummy);
            const completedNonDummies = node.data!.activities.filter(x => !x.chartInfo.isDummy && x.assign.resources.length > 0);
            return nonDummies.length === completedNonDummies.length;
        });
        return completed;
    }
}
