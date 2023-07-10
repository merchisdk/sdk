import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';

export function DomainInvitation() {
    this.resource = '/domain_invitations';
    this.json = 'domainInvitation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'userName');
    addPropertyTo(this, 'userEmail');
    addPropertyTo(this, 'role');
}
