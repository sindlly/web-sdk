class InlineWorker {
    constructor(func) {
        const url = window.URL.createObjectURL(new Blob([`(${func.toString().trim()})()`], {
            type: 'text/javascript'
        }));
        return new Worker(url);
    }
}

export default InlineWorker;