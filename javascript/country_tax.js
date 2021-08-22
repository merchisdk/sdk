import { addPropertyTo, create, serialise, fromJson, enumerateFiles, getOne,
    deleteOne, fromJsonList, getList } from './model';

export function CountryTax() {
    this.resource = '/country_taxes';
    this.json = 'countryTax';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'country');
    addPropertyTo(this, 'taxName');
    addPropertyTo(this, 'taxPercent');

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
    };
    this.get = function (success, error) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };

    this.wrapedRepresentation = function () {
        var representation = this.taxName();
        if (this.country()) {
            representation += " (" + this.country() + ")";
        }
        return representation;
    };
}

export function CountryTaxes() {
    this.resource = '/country_taxes';
    this.json = 'countryTaxes';
    this.single = CountryTax;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };

    this.jsonsForOptions = function (taxes, selectedTaxId) {
        var result = [],
            i;
        for (i = 0; i < taxes.length; i++) {
            result.push({name: taxes[i].wrapedRepresentation(),
                         selected: selectedTaxId &&
                                    taxes[i].id() === selectedTaxId ||
                                   !selectedTaxId &&
                                    taxes[i].id() === window.taxType,
                         id: taxes[i].id()});
        }
        return result;
    };
}

export function NoTaxEntity() {
    var tax = new CountryTax();
    return fromJson(
        tax,
        {id: null, taxName: 'No tax', taxPercent: 0},
        {makesDirty: false}
    );
}
