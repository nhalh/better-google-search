var link = document.querySelectorAll("a")

for (let i = 0; i < link.length; i++)
{
    link[i].href.includes(",vid:") ? Redirect(link[i]) : null;
}

function Redirect(link)
{
    let splitURL = link.href.split(',vid:', 2);
    link.href = 'https://www.youtube.com/watch?v=' + splitURL[1];
}