document.addEventListener('DOMContentLoaded', () => {
    const priceContainer = document.getElementById('price-comparison-container');
    const storeSelect = document.getElementById('store-select');
    
    // Mapa de StoreID a nombres de tiendas
    const storeMap = {
        1: 'Steam',
        2: 'GamersGate',
        3: 'GreenManGaming',
        4: 'Amazon',
        7: 'GOG',
        8: 'Origin',
        11: 'Humble Store',
        13: 'Fanatical',
        21: 'Xbox Store',
        22: 'PlayStation Store',
        23: 'Nintendo Store',
    };

    let allGames = []; // Para almacenar todos los juegos recibidos de la API

    // Función para renderizar los juegos
    const renderGames = (games) => {
        let html = '';
        games.forEach(game => {
            const savings = parseFloat(game.savings); // Aseguramos que sea un número
            const storeName = storeMap[game.storeID] || 'Tienda desconocida'; // Obtenemos el nombre de la tienda

            html += `
                <div class="card">
                    <img src="${game.thumb}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>Precio: $${game.salePrice}</p>
                    ${savings ? `<p>Descuento: ${savings.toFixed(2)}%</p>` : ''}
                    <p>Disponible en: ${storeName}</p>
                    <a href="https://www.cheapshark.com/redirect?dealID=${game.dealID}" target="_blank">Ver en ${storeName}</a>
                </div>
            `;
        });
        priceContainer.innerHTML = html;
    };

    // Función para filtrar juegos por tienda
    const filterGamesByStore = (storeID) => {
        if (storeID === 'all') {
            renderGames(allGames); // Mostrar todos los juegos
        } else {
            const filteredGames = allGames.filter(game => game.storeID === storeID);
            renderGames(filteredGames); // Mostrar solo juegos filtrados
        }
    };

    // Fetch inicial para obtener juegos de varias tiendas
    fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1,21,22,23&upperPrice=50')
        .then(response => response.json())
        .then(data => {
            allGames = data; // Guardamos todos los juegos
            renderGames(allGames); // Renderizamos los juegos al cargar la página
        })
        .catch(err => {
            priceContainer.innerHTML = '<p>Hubo un error al cargar los precios.</p>';
            console.error(err);
        });

    // Evento para filtrar cuando el usuario selecciona una tienda
    storeSelect.addEventListener('change', (event) => {
        const selectedStore = event.target.value;
        filterGamesByStore(selectedStore);
    });
});
