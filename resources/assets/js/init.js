(function(window, document) {
    'use strict';

    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            window.FastClick.attach(document.body);
        }, false);
    }
})(window, document);
