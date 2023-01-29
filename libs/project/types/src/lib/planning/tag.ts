export interface Tag {
    name: string;
    color: string;
    backgroundcolor: string;
}
export interface TagSelectionGroup {
    name: string;
    tags: TagSelection[];
}
export interface TagLoad {
    tags: TagSelection[];
    groups: TagSelectionGroup[];
    activeGroup: TagSelectionGroup | null;
}
export interface TagSelection extends Tag {
    isSelected: boolean;
}
