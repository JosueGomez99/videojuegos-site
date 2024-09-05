document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
  
    // Usa un proxy para evitar el problema de CORS
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://www.eurogamer.net/?format=rss';
  
    fetch(proxyUrl + targetUrl)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const items = data.querySelectorAll("item");
        let html = '';
        items.forEach(el => {
          const title = el.querySelector("title").textContent;
          const link = el.querySelector("link").textContent;
          html += `<div><h3><a href="${link}" target="_blank">${title}</a></h3></div>`;
        });
        newsContainer.innerHTML = html;
      })
      .catch(err => {
        newsContainer.innerHTML = '<p>Hubo un error al cargar las noticias.</p>';
        console.error(err);
      });
  });
  