import { SetMetadata } from '@nestjs/common';
import { Role } from '../../auth/rbac/roles.enum';

// The decorator will accept an array of roles.
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
