(function (global) {
    'use strict';

    async function request(path, options = {}) {
        const baseUrl = global.API_CONFIG?.BASE_URL || '';
        const headers = new Headers(options.headers || {});
        const hasBody = options.body !== undefined && options.body !== null;
        const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

        if (hasBody && !isFormData && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(`${baseUrl}${path}`, {
            credentials: 'include',
            ...options,
            headers,
            body: hasBody && !isFormData && typeof options.body !== 'string'
                ? JSON.stringify(options.body)
                : options.body
        });

        const contentType = response.headers.get('content-type') || '';
        const payload = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            const message = typeof payload === 'string'
                ? payload
                : payload?.message || `HTTP ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }
        return payload;
    }

    global.ApiClient = {
        request,
        get: path => request(path),
        post: (path, body) => request(path, { method: 'POST', body }),
        put: (path, body) => request(path, { method: 'PUT', body }),
        patch: (path, body) => request(path, { method: 'PATCH', body }),
        delete: path => request(path, { method: 'DELETE' })
    };
})(window);
