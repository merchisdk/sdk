import { generateUUID } from './uuid.js';
import { addPropertyTo, getList, fromJsonList } from './model.js';
import { Domain } from './domain';

export function SeoDomainPage() {
    this.resource = '/seo_domain_pages';
    this.json = 'seoDomainPage';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'id');
    addPropertyTo(this, 'metaDescription');
    addPropertyTo(this, 'metaRobots');
    addPropertyTo(this, 'metaTitle');
    addPropertyTo(this, 'pageKey');
    addPropertyTo(this, 'domain', Domain);
}

export function SeoDomainPages() {
    this.resource = '/seo_domain_pages';
    this.json = 'seoDomainPage';
    this.single = SeoDomainPage;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}
