
const textColor = "#f5f7f4";
const gridColor = "#2b312b";
const yellow = "#d3f626" ;

Chart.defaults.color = textColor;
Chart.defaults.borderColor = gridColor;
Chart.defaults.font.family = "Arial";

new Chart(document.getElementById("musicChart"), {
    type: "bar",
    data: {
        labels: ["Música A", "Música B", "Música C", "Música D"],
        datasets: [{
            label: "Valor demonstrativo",
            data: [80, 65, 95, 50],
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
                title: {
                    display: true,
                    text: "Valor demonstrativo"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Músicas"
                }
            }
        }
    }
});

new Chart(document.getElementById("genreChart"), {
    type: "doughnut",
    data: {
        labels: ["Rap", "Pop", "Trap", "Rock"],
        datasets: [{
            data: [35, 25, 25, 15],
            backgroundColor: [
                yellow,
                "#FF0000",
                "#FF007F",
                "#FFD800"
            ],
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
});

new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
        labels: ["Período 1", "Período 2", "Período 3", "Período 4"],
        datasets: [{
            label: "Valor demonstrativo",
            data: [30, 45, 40, 70],
            borderColor: green,
            backgroundColor: "#d3ef1d",
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
                title: {
                    display: true,
                    text: "Valor demonstrativo"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Períodos"
                }
            }
        }
    }
});
