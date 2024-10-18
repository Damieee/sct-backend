import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserRole } from './user.entity';

// Create a custom pipe to validate the role
@Injectable()
export class RoleValidationPipe implements PipeTransform {
  readonly allowedRoles = [UserRole.USER, UserRole.ADMIN];

  transform(value: UserRole) {
    if (!this.isRoleValid(value)) {
      throw new BadRequestException(`${value} is an invalid role`);
    }
    return value;
  }

  private isRoleValid(role: UserRole) {
    const idx = this.allowedRoles.indexOf(role);
    return idx !== -1;
  }
}
