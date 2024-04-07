document.addEventListener('DOMContentLoaded', function ()
{
    var quora = document.getElementById('quora');
    var youtube = document.getElementById('youtube');
    var reddit = document.getElementById('reddit');

    chrome.storage.local.get(['quoraState', 'youtubeState', 'redditState'], function (result)
    {
        quora.checked = result.quoraState || false;
        youtube.checked = result.youtubeState || false;
        reddit.checked = result.redditState || false;
    });

    quora.addEventListener('change', function ()
    {
        chrome.storage.local.set({ 'quoraState': quora.checked });
    });

    youtube.addEventListener('change', function ()
    {
        chrome.storage.local.set({ 'youtubeState': youtube.checked });
    });

    reddit.addEventListener('change', function ()
    {
        chrome.storage.local.set({ 'redditState': reddit.checked });
    });
});
