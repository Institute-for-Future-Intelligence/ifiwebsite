(function () {
    function syncLoad(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        try { xhr.send(); } catch (e) { return ''; }
        return (xhr.status === 200 || xhr.status === 0) ? xhr.responseText : '';
    }
    window.includeHeader = function () { document.write(syncLoad('partials/header.html')); };
    window.includeFooter = function () { document.write(syncLoad('partials/footer.html')); };
})();
