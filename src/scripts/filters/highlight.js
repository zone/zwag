'use strict';

module.exports = function($sce) {
    return function(text, phrase) {
        if (phrase) {
            text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<mark class="highlight">$1</mark>');
        }

        return $sce.trustAsHtml(text);
    };
};
