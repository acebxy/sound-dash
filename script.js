

const textColor = "#f5f7f4";
const gridColor = "#2b312b";
const yellow = "#d3f626";
const green = "#155833";

// Configurações gerais do Chart.js
Chart.defaults.color = textColor;
Chart.defaults.borderColor = gridColor;
Chart.defaults.font.family = "Arial";

// ===== GRÁFICO 1: MÚSICAS POR ARTISTA =====

const musicChart = new Chart(
    document.getElementById("musicChart"),
    {
        type: "bar",
        data: {
            labels: ["Aguardando pesquisa"],
            datasets: [{
                label: "Músicas encontradas",
                data: [0],
                backgroundColor: yellow,
                borderRadius: 14
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: "Quantidade de músicas (unidades)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Artistas"
                    }
                }
            }
        }
    }
);

// ===== GRÁFICO 2: MÚSICAS POR GÊNERO =====

const genreChart = new Chart(
    document.getElementById("genreChart"),
    {
        type: "doughnut",
        data: {
            labels: ["Aguardando pesquisa"],
            datasets: [{
                data: [1],
                backgroundColor: [green],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    }
);

// ===== GRÁFICO 3: LANÇAMENTOS POR ANO =====

const trendChart = new Chart(
    document.getElementById("trendChart"),
    {
        type: "line",
        data: {
            labels: ["Aguardando pesquisa"],
            datasets: [{
                label: "Músicas lançadas",
                data: [0],
                borderColor: green,
                backgroundColor: "rgba(211, 246, 38, 0.2)",
                fill: true,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: "Quantidade de músicas (unidades)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Ano de lançamento"
                    }
                }
            }
        }
    }
);

// ===== ATUALIZAR OS GRÁFICOS =====

function updateMusicCharts(musics) {
    // Conta os resultados por artista
    const artistCounts = {};

    musics.forEach((music) => {
        const artist = music.artistName || "Artista desconhecido";

        artistCounts[artist] =
            (artistCounts[artist] || 0) + 1;
    });

    const artists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    musicChart.data.labels = artists.length
        ? artists.map((item) => item[0])
        : ["Nenhum resultado"];

    musicChart.data.datasets[0].data = artists.length
        ? artists.map((item) => item[1])
        : [0];

    musicChart.update();

    // Conta os resultados por gênero musical
    const genreCounts = {};

    musics.forEach((music) => {
        const genre =
            music.primaryGenreName || "Gênero não informado";

        genreCounts[genre] =
            (genreCounts[genre] || 0) + 1;
    });

    const genres = Object.entries(genreCounts);

    genreChart.data.labels = genres.length
        ? genres.map((item) => item[0])
        : ["Nenhum resultado"];

    genreChart.data.datasets[0].data = genres.length
        ? genres.map((item) => item[1])
        : [1];

    genreChart.data.datasets[0].backgroundColor = genres.length
        ? genres.map((_, index) => {
            const colors = [
                yellow,
                green,
                "#FF007F",
                "#FF8C42",
                "#7B61FF",
                "#40C9A2"
            ];

            return colors[index % colors.length];
        })
        : [gridColor];

    genreChart.update();

    // Conta os resultados por ano de lançamento
    const yearCounts = {};

    musics.forEach((music) => {
        if (!music.releaseDate) return;

        const year = music.releaseDate.slice(0, 4);

        if (!/^\d{4}$/.test(year)) return;

        yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const years = Object.keys(yearCounts).sort();

    trendChart.data.labels = years.length
        ? years
        : ["Sem datas disponíveis"];

    trendChart.data.datasets[0].data = years.length
        ? years.map((year) => yearCounts[year])
        : [0];

    trendChart.update();
}

// ===== ELEMENTOS DA PESQUISA =====

const musicSearch = document.getElementById("musicSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");
const searchResults = document.getElementById("searchResults");

// ===== PESQUISAR MÚSICAS NA API DO ITUNES =====

async function searchMusic() {
    const query = musicSearch.value.trim();

    if (query === "") {
        searchMessage.textContent =
            "Digite o nome de uma música ou artista.";

        searchResults.replaceChildren();
        return;
    }

    searchMessage.textContent = "Pesquisando músicas...";
    searchResults.replaceChildren();
    searchButton.disabled = true;

    try {
        const url =
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Não foi possível consultar a API.");
        }

        const data = await response.json();
        const musics = data.results || [];

        // Atualiza os gráficos com os dados recebidos
        updateMusicCharts(musics);

        if (musics.length === 0) {
            searchMessage.textContent =
                "Nenhuma música encontrada. Tente outro termo.";

            return;
        }

        searchMessage.textContent =
            `Encontramos ${musics.length} resultado(s).`;

        musics.forEach((music) => {
            const card = document.createElement("article");
            card.className = "music-result-card";

            const cover = document.createElement("img");

            if (music.artworkUrl100) {
                cover.src = music.artworkUrl100;
            }

            cover.alt =
                `Capa do álbum ${music.collectionName || music.trackName}`;

            cover.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = music.trackName || "Música sem título";

            const artist = document.createElement("p");
            artist.textContent =
                music.artistName || "Artista desconhecido";

            const album = document.createElement("p");
            album.textContent =
                music.collectionName || "Álbum não informado";

            card.append(cover, title, artist, album);

            if (music.trackViewUrl) {
                const link = document.createElement("a");

                link.href = music.trackViewUrl;
                link.textContent = "Ver música";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                card.append(link);
            }

            searchResults.append(card);
        });

    } catch (error) {
        searchMessage.textContent =
            "Ocorreu um erro na pesquisa. Verifique sua conexão e tente novamente.";

        console.error("Erro na pesquisa musical:", error);

    } finally {
        searchButton.disabled = false;
    }
}

// Pesquisa ao clicar no botão
searchButton.addEventListener("click", searchMusic);

// Pesquisa ao pressionar Enter
musicSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchMusic();
    }
});

