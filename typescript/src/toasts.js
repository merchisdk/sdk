export var toastNotifications = function (merchi, options) {
    var resource = '/notifications-check-update/';
    var data = new FormData();
    var entities = options.entities, sections = options.sections, notificationTypes = options.notificationTypes;
    data.set('entities', JSON.stringify(entities));
    data.set('sections', JSON.stringify(sections));
    data.set('notificationTypes', JSON.stringify(notificationTypes));
    var fetchOptions = { method: 'POST', body: data };
    return merchi
        .authenticatedFetch(resource, fetchOptions)
        .then(function (data) {
        return data.notifications.map(function (n) { return new merchi.Notification().fromJson(n); });
    });
};
