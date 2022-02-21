'use strict';

const http = require('http');
const url = require('url');


module.exports = {
    get(url) {
        return this._makeRequest('GET', url);
    },

    _makeRequest(method, urlString, options) {

        // create a new Promise
        return new Promise((resolve, reject) => {

            /* Node's URL library allows us to create a
             * URL object from our request string, so we can build
             * our request for http.get */
            const parsedUrl = url.parse(urlString);
            console.log("parsed url")
            console.log(parsedUrl)
            const requestOptions = this._createOptions(method, parsedUrl);
            const request = http.get(requestOptions, res => this._onResponse(res, resolve, reject));

            /* if there's an error, then reject the Promise
             * (can be handled with Promise.prototype.catch) */
            request.on('error', reject);

            request.end();
        });
    },

    // the options that are required by http.get
    _createOptions(method, url) {
        var requestOptions = {
            hostname: url.hostname,
            path: url.path,
            port: url.port,
            method
        };
        return requestOptions
    },

    /* once http.get returns a response, build it and 
     * resolve or reject the Promise */
    _onResponse(response, resolve, reject) {
        const hasResponseFailed = response.status >= 400;
        var responseBody = '';

        if (hasResponseFailed) {
            reject(`Request to ${response.url} failed with HTTP ${response.status}`);
        }

        /* the response stream's (an instance of Stream) current data. See:
         * https://nodejs.org/api/stream.html#stream_event_data */
        response.on('data', chunk => responseBody += chunk.toString());

        // once all the data has been read, resolve the Promise 
        response.on('end', () => resolve(responseBody));
    }
};