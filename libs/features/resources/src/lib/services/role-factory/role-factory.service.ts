import { Injectable } from '@angular/core';
import { Role } from '@critical-pass/project/types';
import { ColorFactoryService, RoleSerializerService, RoleSummarySerializerService } from '@critical-pass/shared/serializers';
import * as CONST from '../../constants';
@Injectable({
  providedIn: 'root'
})
export class RoleFactoryService {

  constructor(private colorFactory: ColorFactoryService, private roleSerializer: RoleSerializerService, private roleSummarySerializer: RoleSummarySerializerService) { }

  addRole(name: string, roleList: Role[]) {
    const role = this.roleSerializer.fromJson();
    role.name = name;
    const colorIndex = roleList.length;
    const newColor = this.colorFactory.getColor(CONST.RESOURCE_COLOR_SCHEME, colorIndex);
    role.view.color = newColor;
    roleList.push(role);
  }
  getSummary(role: Role) {
    const summary = this.roleSummarySerializer.fromJson()
    summary.color = role.view.color;
    summary.id = role.id;
    summary.name = role.name;
    return summary;
  }
}
