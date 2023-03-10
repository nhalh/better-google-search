let links = document.querySelectorAll('a');
for (let i = 0, len = links.length; i < len; i++) {
  let link = links[i];
  link.removeAttribute('data-vll');
  if (link.href.includes(",vid:")) {
    let splitURL = link.href.split(',vid:', 2);
    link.href = 'https://www.youtube.com/watch?v=' + splitURL[1];
  }
}