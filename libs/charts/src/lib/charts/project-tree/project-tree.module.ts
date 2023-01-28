import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTreeComponent } from './project-tree.component';
import { TreeButtonsComponent } from './tree-buttons/tree-buttons.component';

@NgModule({
    declarations: [ProjectTreeComponent, TreeButtonsComponent],
    imports: [CommonModule],
    exports: [ProjectTreeComponent, TreeButtonsComponent],
})
export class ProjectTreeModule {}
