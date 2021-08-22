import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { Company } from './company';
import { User } from './user';

export function UserCompany() {
    this.resource = '/user_companies';
    this.json = 'userCompany';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'isAdmin');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'company', Company);
}
