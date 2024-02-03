let enableQuora = false;
let enableYoutube = false;

chrome.storage.local.get(['quoraState', 'youtubeState'], function (result)
{
  enableQuora = result.quoraState || false;
  enableYoutube = result.youtubeState || false;
  setFeatures(); // Run with initial state
});

chrome.storage.onChanged.addListener(function (changes, namespace)
{
  for (let [key, { oldValue, newValue }] of Object.entries(changes))
  {
    if (key === 'quoraState')
    {
      enableQuora = newValue;
      console.log("Quora is " + (enableQuora ? "enabled" : "disabled"));
    }
    if (key === 'youtubeState')
    {
      enableYoutube = newValue;
      console.log("YouTube is " + (enableYoutube ? "enabled" : "disabled"));
    }
  }
  setFeatures();
});


function setFeatures()
{
  if (enableQuora)
  {
    runQuora();
  }
  if (enableYoutube)
  {
    runYoutube()
  }
}

function runQuora()
{
  let results = document.querySelectorAll('span');

  results.forEach(result =>
  {
    if (result.textContent === 'Quora')
    {
      let grandparent = result.closest('.MjjYud');
      if (grandparent) grandparent.remove();
    }
  })

}

function runYoutube()
{
  let links = document.querySelectorAll('a[data-ved]');
  links.forEach(link =>
  {
    let closestElementWithDataSurl = link.closest('[data-surl]');

    if (closestElementWithDataSurl)
    {
      let dataSurl = closestElementWithDataSurl.getAttribute('data-surl');
      if (dataSurl && dataSurl.includes('youtube.com'))
      {
        link.removeAttribute('data-ved');
        link.href = dataSurl;
      }
    }
  });
}


const observer = new MutationObserver((mutationsList) =>
{
  for (let mutation of mutationsList)
  {
    if (mutation.type === 'childList')
    {
      setFeatures();
    }
  }
});

const targetNode = document.getElementById("center_col");
if (targetNode)
{
  observer.observe(targetNode, { childList: true, subtree: true });
}

// Initial run
setFeatures();
