import { Edge } from './edge';

export interface Vertex {
    id: number;
    edges: Edge[];
    curEdge: number;
    selected: boolean;
    isBeginning: boolean;
    isEnd: boolean;
    visited: boolean;
    previous: Vertex;
    next: Vertex;
    distance: number;
    LFT: number;
}
