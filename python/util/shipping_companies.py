# when adding new company, make sure last elem in list is custom
SHIPPING_COMPANIES = ['DHL', 'UPS', 'EMS', 'FedEx',
                      'Australia Post', 'StarTrack', 'Toll', 'TNT',
                      'Custom Track Link', 'Aramex',
                      'realtime express', 'Uber',
                      'Civic Transport Couriers',
                      'NZ Post', 'Sendle', 'UPS', 'USPS']

SHIPPING_TRANSPORT_COMPANIES = dict(enumerate(SHIPPING_COMPANIES))
