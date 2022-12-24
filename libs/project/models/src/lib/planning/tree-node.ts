// import { Serializer } from '../../services/serializers/serializer';
import { Project } from '../project/project';

export interface TreeNode /*<T, U>*/ {
    parent: TreeNode;
    children: TreeNode /*<T, U>*/[];
    data: Project; //T;
    name: string;
    id: number;
    group: number;
    subgroup: number;
    parentNodeId: number; // This is for reconstructing tree after file load
    metadata: ProjectMetadata; //U;
    // assignmentCompleted: boolean;
    // cost: number;
    // time: number;
    // constructor() {
    //   this.parent = null;
    //   this.children = [];
    //   this.name = '';
    //   this.id = 0;
    //   this.group = 0;
    //   this.subgroup = 0;
    //   this.assignmentCompleted = false;
    //   this.cost = 0;
    //   this.time = 0;
    // }
}

export interface ProjectMetadata {
    assignmentCompleted: boolean;
    cost: number;
    time: number;
    //   this.cost = 0;
    //   this.time = 0;
}

// export class ProjectTreeNodeSerializerService implements Serializer<TreeNode> /*<T, U>>*/ {
//     fromJson(json?: any): TreeNode {
//         json = json ?? {};
//         const obj: TreeNode = {
//             // parentNodeId: json?.parentNodeId ?? null,
//             // nodeId: json?.nodeId ?? null,
//             name: json?.name ?? null,
//             group: json?.group ?? null,
//             subgroup: json?.subgroup ?? null,
//             metadata: json?.metadata ?? null,
//             data: json?.data ?? null,
//             children: json?.children ?? [],
//             id: json?.id ?? null,
//             parent: json.parent ?? null,
//             parentNodeId: json?.parentNodeId ?? null,
//         };
//         return obj;
//     }
//     toJson(obj: TreeNode): any {}

//     head(): TreeNode {
//         return {
//             id: 0,
//             group: 0,
//             subgroup: 0,
//             name: 'head',
//             data: null,
//             children: [],
//             parent: null,
//             metadata: null,
//             parentNodeId: null,
//         };
//     }
// }
