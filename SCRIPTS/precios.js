document.addEventListener("DOMContentLoaded", () => {
    const storeCardsContainer = document.getElementById("store-cards-container");
    const priceContainer = document.getElementById("price-comparison-container");

    // Mapa de tiendas permitidas con sus IDs
    const allowedStores = {
        '1': 'steam',
        '2': 'gamersgate',
        '3': 'greenmangaming',
        '7': 'gog',
        '8': 'origin',
        '11': 'humblestore',
        '12': 'uplay',
        '14': 'fanatical',
        '21': 'wingamestore',
        '23': 'gamebillet',
        '24': 'voidu',
        '25': 'epicgamestore',
        '27': 'gamesplanet',
        '28': 'gamesload',
        '29': '2game',
        '30': 'indiegala',
        '31': 'blizzardshop',
        '33': 'dlgamer',
        '34': 'noctre',
        '35': 'dreamgame'
    };

    const storeMap = {};

    const fetchStoreImages = () => {
        fetch('https://www.cheapshark.com/api/1.0/stores')
            .then(response => response.json())
            .then(data => {
                console.log('Datos de la API de tiendas:', data); // Mensaje de depuración

                if (Array.isArray(data)) {
                    const filteredStores = data.filter(store => allowedStores[store.storeID]);

                    filteredStores.forEach(store => {
                        const storeId = store.storeID;
                        storeMap[storeId] = {
                            name: store.storeName,
                            image: `https://www.cheapshark.com${store.images.banner}`
                        };
                    });

                    renderStoreCards(filteredStores);
                } else {
                    console.error('Error: La respuesta de la API de tiendas no es un array.');
                }
            })
            .catch(err => console.error('Error fetching store images:', err));
    };

    const renderStoreCards = (stores) => {
        if (stores.length === 0) {
            storeCardsContainer.innerHTML = "<p>No se encontraron tiendas.</p>";
            return;
        }

        let html = "";
        stores.forEach((store) => {
            html += `
                <div class="store-card" data-store-id="${store.storeID}">
                    <img src="${storeMap[store.storeID].image}" alt="${storeMap[store.storeID].name}">
                    <h3>${storeMap[store.storeID].name}</h3>
                </div>
            `;
        });
        storeCardsContainer.innerHTML = html;
    };

    const fetchGamesByStore = async (storeID) => {
        priceContainer.innerHTML = "<p>Cargando juegos...</p>"; // Mensaje de carga

        try {
            const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=${storeID}&upperPrice=15`);
            const data = await response.json();
            console.log('Datos de la API de juegos:', data); // Mensaje de depuración

            if (data && Array.isArray(data)) {
                renderGames(data);
            } else {
                console.log('Datos recibidos:', data);
                priceContainer.innerHTML = "<p>No se encontraron juegos.</p>";
            }
        } catch (err) {
            priceContainer.innerHTML = "<p>Hubo un error al cargar los juegos.</p>";
            console.error('Error en fetchGamesByStore:', err);
        }
    };

    const renderGames = (games) => {
        console.log('Datos de los juegos:', games); // Agrega este registro

        if (games.length === 0) {
            priceContainer.innerHTML = "<p>No se encontraron juegos.</p>";
            return;
        }

        let html = "";
        games.forEach((game) => {
            const savings = parseFloat(game.savings || 0);
            const storeName = storeMap[game.storeID]?.name || "Tienda desconocida";
            const price = game.normalPrice || "N/A"; // Asegúrate de que esta propiedad coincida con la respuesta de la API

            html += `
                <div class="card" data-deal-id="${game.dealID}">
                    <img src="${game.thumb}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>Precio: $${price}</p>
                    ${savings ? `<p>Descuento: ${savings.toFixed(2)}%</p>` : ""}
                    <p>Disponible en: ${storeName}</p>
                    <a href="https://www.cheapshark.com/redirect?dealID=${game.dealID}" target="_blank">Ver en ${storeName}</a>
                </div>
            `;
        });
        priceContainer.innerHTML = html;
    };

    const handleStoreClick = (event) => {
        const storeCard = event.target.closest(".store-card");
        if (storeCard) {
            const storeID = storeCard.getAttribute("data-store-id");
            console.log('ID de tienda seleccionado:', storeID); // Agrega este registro
            fetchGamesByStore(storeID);
        }
    };

    storeCardsContainer.addEventListener("click", handleStoreClick);

    // Fetch inicial
    fetchStoreImages();
});
