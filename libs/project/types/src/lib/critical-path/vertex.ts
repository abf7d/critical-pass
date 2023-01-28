import { Edge } from './edge';

export interface Vertex {
    id: number;
    edges: Edge[];
    curEdge: number | null;
    selected: boolean;
    isBeginning: boolean;
    isEnd: boolean;
    visited: boolean;
    previous: Vertex | null;
    next: Vertex | null;
    distance: number | null;
    LFT: number | null;
}
