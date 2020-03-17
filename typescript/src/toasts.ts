
export function backendFetch(resource: string, options?: RequestOptions) {
  const server = (window as any).merchiBackendUri ?
    (window as any).merchiBackendUri : BACKEND_URI;
  const version = 'v6';
  const url = new URL(server + version + resource);
  if (options && options.query) {
    for (let entry of options.query) {
      url.searchParams.append(entry[0], entry[1]);
    }
  }
  return fetch(url.toString(), options);
}
    function checkAndUpdateNotifications(related_object_id, section,
        senderId, success, error) {
        var request = new Request(),
            data = new Dictionary();
        request.resource('/notifications-toast/');
        request.method('POST');
        data.add('related_object_id', related_object_id);
        data.add('section', section);
        data.add('sender_id', senderId);
        request.query().add('skip_rights', 'y');
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();

        subscriptionManager.subscribe([eventTypes.get('POST')], request.path(),
                                      "POST", handleResponse);
    }

