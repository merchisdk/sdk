export function generateUUID() {
    var d = new Date().getTime(),
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    if (window.performance &&
            typeof window.performance.now === "function") {
        d += performance.now();
    }
    uuid = uuid.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
}
