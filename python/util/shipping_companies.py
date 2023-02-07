# when adding new company, make sure last elem in list is custom
SHIPPING_COMPANIES = ['DHL', 'UPS', 'EMS', 'FedEx',
                      'Australia Post', 'StarTrack', 'Toll', 'TNT',
                      'Custom Track Link', 'Aramex',
                      'realtime express', 'Uber',
                      'Civic Transport Couriers',
                      'NZ Post', 'Sendle', 'UPS', 'USPS']

SHIPPING_TRANSPORT_COMPANIES = dict(enumerate(SHIPPING_COMPANIES))

DHL = SHIPPING_COMPANIES.index('DHL')
UPS = SHIPPING_COMPANIES.index('UPS')
EMS = SHIPPING_COMPANIES.index('EMS')
FEDEX = SHIPPING_COMPANIES.index('FedEx')
AUSTRALIA_POST = SHIPPING_COMPANIES.index('Australia Post')
STARTRACK = SHIPPING_COMPANIES.index('StarTrack')
TOLL = SHIPPING_COMPANIES.index('Toll')
TNT = SHIPPING_COMPANIES.index('TNT')
CUSTOM_TRACK_LINK = SHIPPING_COMPANIES.index('Custom Track Link')
ARAMEX = SHIPPING_COMPANIES.index('Aramex')
REALTIME_EXPRESS = SHIPPING_COMPANIES.index('realtime express')
UBER = SHIPPING_COMPANIES.index('Uber')
CIVIC_TRANSPORT_COURIERS = SHIPPING_COMPANIES.index(
    'Civic Transport Couriers')
NZ_POST = SHIPPING_COMPANIES.index('NZ Post')
SENDLE = SHIPPING_COMPANIES.index('Sendle')
UPS = SHIPPING_COMPANIES.index('UPS')
USPS = SHIPPING_COMPANIES.index('USPS')
