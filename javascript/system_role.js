import { addPropertyTo } from './model';

export function SystemRole() {
    this.resource = '/system_roles';
    this.json = 'systemRole';

    addPropertyTo(this, 'role');
}
