import { Edge } from './edge';
// export class FloatInfo {
//     id: number;
//     Duration: number;
//     EFTE_Tail: number;
//     LFTE_Tail: number;
//     EFTE_Head: number;
//     LFTE_Head: number;
//     EST: number;
//     EFT: number;
//     LFT: number;
//     LST: number;
//     TF: number;
//     forwardActivity: Edge;
//     FF: number;
//     IF: number;
//     MinEST: number;
//     constructor(forwardActivity) {
//         // forward has EFTe Tail, reverse has LFTE Tail

//         // tail is source or orgin, head is target or destination
//         this.id = forwardActivity.id;
//         this.Duration = forwardActivity.weight;
//         this.EFTE_Tail = forwardActivity.origin.distance;
//         this.LFTE_Tail = forwardActivity.origin.LFT;
//         this.EFTE_Head = forwardActivity.destination.distance;
//         this.LFTE_Head = forwardActivity.destination.LFT;
//         this.MinEST = forwardActivity.minEST;

//         this.EST = this.EFTE_Tail;
//         if (this.MinEST !== null && this.EST < this.MinEST) {
//             this.EST = this.MinEST;
//         }
//         this.EFT = this.EST + this.Duration;
//         this.LFT = this.LFTE_Head;
//         this.LST = this.LFT - this.Duration;
//         this.TF = this.LFT - this.EFT;

//         forwardActivity.float = this;
//         this.forwardActivity = forwardActivity;
//         this.FF = 0; // Get other edges  (not equal to this one) from the head (that have the head as tail), take min EST then subract EFT
//         // take the minimum EST from the connected following activities minus @ EFT
//         this.IF = 0;
//     }

//     // Calculate
//     CalculateFFandIF() {
//         const activity = this.forwardActivity;
//         const { edges } = activity.destination;

//         const minESTedge = _.minBy(edges, e => {
//             if (e === activity) {
//                 return Infinity;
//             } else if (activity.destination === e.destination) {
//                 // if edge e is an imcoming edge and not a following activity
//                 return Infinity;
//             } else {
//                 return e.float.EST;
//             }
//         });
//         let minEST = minESTedge.float.EST;
//         const outArrows = _.filter(edges, e => activity.destination !== e.destination);
//         const isEnd = outArrows.length === 0;

//         if (minEST === Infinity) {
//             minEST = 0;
//         }

//         if (isEnd) {
//             this.FF = 0;
//         } else {
//             this.FF = minEST - this.EFT;
//         }
//         return (this.IF = this.TF - this.FF);
//     }
// }

export interface FloatInfo {
    id: number;
    duration: number;
    EFTE_Tail: number;
    LFTE_Tail: number;
    EFTE_Head: number;
    LFTE_Head: number;
    EST: number;
    EFT: number;
    LFT: number;
    LST: number;
    TF: number;
    forwardActivity: Edge;
    FF: number;
    IF: number;
    minEST: number;
}
