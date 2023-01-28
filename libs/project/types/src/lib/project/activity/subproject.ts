import { Project } from '../project';

export interface ActivitySubProject {
    subGraphId: number;
    isParent: boolean;
    subGraphLoaded?: Project;
    graphId: number;
}
