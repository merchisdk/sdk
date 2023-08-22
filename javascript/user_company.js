import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';
import { Company } from './company.js';
import { User } from './user.js';

export function UserCompany() {
    this.resource = '/user_companies';
    this.json = 'userCompany';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'isAdmin');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'company', Company);
}
