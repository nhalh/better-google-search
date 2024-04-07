let enableQuora = false;
let enableYoutube = false;
let enableReddit = false;

chrome.storage.local.get(['quoraState', 'youtubeState', 'redditState'], function (result)
{
  enableQuora = result.quoraState || false;
  enableYoutube = result.youtubeState || false;
  enableReddit = result.redditState || false;
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
    if (key === 'redditState')
    {
      enableReddit = newValue;
      console.log("Reddit is " + (enableReddit ? "enabled" : "disabled"));
    }
  }
  setFeatures();
});

// Enable features
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
  if (enableReddit)
  {
    runReddit()
  }
}

// Run features
function runQuora()
{
  if (document.querySelector('.YmvwI[selected]').textContent == 'All')
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

function runReddit()
{
  // Get original search button
  const originalSearchButton = document.querySelector('button.Tg7LZd');

  // Clone search button
  const clonedSearchButton = originalSearchButton.cloneNode(true);

  // Remove cloned searched button's icon
  const oldIcon = clonedSearchButton.querySelector('svg');
  if (oldIcon)
  {
    oldIcon.parentNode.removeChild(oldIcon);
  }

  // Add Reddit icon to the cloned searched button
  const redditIco = document.createElement('img');
  redditIco.src = chrome.runtime.getURL('Images/reddit.png');
  redditIco.style.width = '24px';
  redditIco.style.height = '24px';

  // Append to a span element
  const spanElement = clonedSearchButton.querySelector('.z1asCe.MZy1Rb');
  if (spanElement)
  {
    spanElement.appendChild(redditIco);
  } else
  {
    // If the span does not exist, append the icon directly to the button
    clonedSearchButton.appendChild(redditIco);
  }

  // Append " reddit" and search when clicked
  clonedSearchButton.addEventListener('click', () =>
  {
    document.querySelector('textarea.gLFyf[aria-label="Search"][aria-owns="Alh6id"]').value = document.querySelector('textarea.gLFyf[aria-label="Search"][aria-owns="Alh6id"]').value + ' reddit'

  }, true)

  // Append to parent container and align it next to the search button
  originalSearchButton.parentNode.insertBefore(clonedSearchButton, originalSearchButton.nextSibling);

}


const observer = new MutationObserver((mutationsList) =>
{
  for (let mutation of mutationsList)
  {
    if (mutation.type === 'childList')
    {
      runYoutube();
      runQuora();
    }
  }
});

const targetNode = document.getElementById("center_col");
if (targetNode)
{
  observer.observe(targetNode, { childList: true, subtree: true });
}