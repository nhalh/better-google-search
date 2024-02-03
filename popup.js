document.addEventListener('DOMContentLoaded', function ()
{
    var quora = document.getElementById('quora');
    var youtube = document.getElementById('youtube');

    chrome.storage.local.get(['quoraState', 'youtubeState'], function (result)
    {
        quora.checked = result.quoraState || false;
        youtube.checked = result.youtubeState || false;
    });

    quora.addEventListener('change', function ()
    {
        chrome.storage.local.set({ 'quoraState': quora.checked });
    });

    youtube.addEventListener('change', function ()
    {
        chrome.storage.local.set({ 'youtubeState': youtube.checked });
    });
});
