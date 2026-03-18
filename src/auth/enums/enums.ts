import { registerEnumType } from '@nestjs/graphql';
import { Priority, Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'The user roles for authorization',
});
registerEnumType(Priority, {
  name: 'Priority',
  description: 'The ticket priority levels',
});

export { Role, Priority };
