import { FloatInfo } from './float-info';
import { Vertex } from './vertex';

export interface Edge {
    id: number;
    weight: number;
    origin: Vertex;
    destination: Vertex;
    float: FloatInfo;
    minEST: number;
}
