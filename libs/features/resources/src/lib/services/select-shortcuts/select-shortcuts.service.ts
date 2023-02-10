import { Injectable } from '@angular/core';
import { Activity, Project, Resource } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class SelectShortcutsService {
    shiftOn: boolean;
    ctrlOn: boolean;
    firstIndex: number | null;
    lastClickedShift: number | null = null;

    private _project!: Project;
    set project(proj: Project) {
        this._project = proj;
    }
    constructor() {
        this.shiftOn = false;
        this.ctrlOn = false;
        this.firstIndex = null;
    }
    keyDown(keyCode: number) {
        if (keyCode === 16) {
            this.shiftOn = true;
            this.firstIndex = this.lastClickedShift;
        }
        if (keyCode === 17) {
            this.ctrlOn = true;
        }
    }
    keyUp(keyCode: number) {
        if (keyCode === 16) {
            this.shiftOn = false;
        }
        if (keyCode === 17) {
            this.firstIndex = this.lastClickedShift;
            this.ctrlOn = false;
        }
    }

    // Select the activities on page via click, ctrl+click, and shift+ click.
    // They are highlighted in yellow.
    itemClicked(clickedActivity: Activity, index: number, project: Project) {
        // Set the first index, if this is a single click clear the rest
        if (this.firstIndex === null) {
            this.firstIndex = index;
        }

        // If clicking without shift/ctrl clear everything first
        if (!this.shiftOn && !this.ctrlOn) {
            for (const activity of project.activities) {
                activity.assign.isSelected = false;
            }
        }

        // Toggle on/off clicked activity
        clickedActivity.assign.isSelected = !clickedActivity.assign.isSelected;

        // If last clicked activity index is not this one and pressing shift
        // Select from the top point to the bottom
        if (this.lastClickedShift !== index && this.shiftOn) {
            const sorted = [index, this.firstIndex].sort((a, b) => a - b);
            const start = sorted[0];
            const end = sorted[1];
            for (let highlightIndex = start; highlightIndex < end; ++highlightIndex) {
                const activity = project.activities[highlightIndex];
                activity.assign.isSelected = true;
            }
        }

        this.lastClickedShift = index;
        return project;
    }

    // Select the activities on page via click, ctrl+click, and shift+ click.
    // They are highlighted in yellow.
    resourceClicked(clickedResource: Resource, index: number, project: Project) {
        // Set the first index, if this is a single click clear the rest
        if (this.firstIndex === null) {
            this.firstIndex = index;
        }

        // If clicking without shift/ctrl clear everything first
        if (!this.shiftOn && !this.ctrlOn) {
            for (const resource of project.resources) {
                resource.assign.isSelected = false;
            }
        }

        // Toggle on/off clicked activity
        clickedResource.assign.isSelected = !clickedResource.assign.isSelected;

        // If last clicked activity index is not this one and pressing shift
        // Select from the top point to the bottom
        if (this.lastClickedShift !== index && this.shiftOn) {
            const sorted = [index, this.firstIndex].sort((a, b) => a - b);
            const start = sorted[0];
            const end = sorted[1];
            for (let highlightIndex = start; highlightIndex < end; ++highlightIndex) {
                const resource = project.resources[highlightIndex];
                resource.assign.isSelected = true;
            }
        }

        this.lastClickedShift = index;
        return project;
    }
}
