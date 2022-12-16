import { Project } from '../project';

export interface SubProject {
    subGraphId: number;
    isParent: boolean;
    subGraphLoaded?: Project;
    graphId: number;
}
