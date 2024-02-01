document.addEventListener('DOMContentLoaded', function () {
    // Obtenir le chemin de l'URL actuelle
    const currentPath = window.location.pathname;
    if (currentPath === '/index.html') {
        var myData = localStorage.getItem("data");
        if (!myData && !storedData) {
            window.location.href = 'login.html';
        }
        console.log('Chargement de la page /index.html');
    } else if (currentPath === '/login.html') {
        console.log('Chargement de la page /login.html');
    } else {
        window.location.href = 'login.html';
    }
});

window.addEventListener('beforeunload', function (event) {
    if (storedData) {
        localStorage.setItem("data", storedData);
    }
});

const storedData = localStorage.getItem("data");
setTimeout(() => {
    localStorage.setItem("data", '');
}, 300);

const parsedData = JSON.parse(storedData);
var nbrXp = Math.round(parsedData.data.kb.aggregate.sum.amount / 1000)
var content = document.createElement('div')
content.classList.add('container-fluid')

const data = [20, 40, 60, 80, 147, 75, 50, 25, 90, 30];
const Data = parsedData.data.xp;

const svgWidth = 800;
const svgHeight = 600;

const barPadding = 5;

function createDiagrammeBar() {
    console.log('voici mes donnees   ', storedData);
    const svg = content.querySelector('.bar-chart');
    const barWidth = (svgWidth / data.length) - barPadding;
    const scaleY = svgHeight / Math.max(...data);

    data.forEach((val, index) => {
        var value = Math.round(Data[index].amount / 1000);
        console.log(Math.round(value));

        // Calculer la hauteur de la barre en fonction des données et de la hauteur du SVG
        const barHeight = value * scaleY;
        var name = Data[index].object.name;

        // Créer un élément rectangle (barre) pour chaque donnée
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', index * (barWidth + barPadding));
        rect.setAttribute('y', svgHeight - barHeight);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', '#9969ff');

        // Ajouter la barre à l'élément SVG
        svg.appendChild(rect);
        if (index <= 5) {
            var n = 80;

        } else {
            n = -19
        }

        // Ajouter une étiquette pour chaque barre
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', index * (barWidth + barPadding) + barWidth / 2);
        label.setAttribute('y', svgHeight - barHeight + n); // Descendre le texte de 20 pixels
        label.setAttribute('text-anchor', 'middle'); // Centrer le texte horizontalement
        label.setAttribute('transform', `rotate(90 ${index * (barWidth + barPadding) + barWidth / 2} ${svgHeight - barHeight + n})`); // Rotation de 90 degrés
        label.textContent = name; // Utiliser le nom au lieu de la valeur
        svg.appendChild(label);
    });

    // Ajouter des axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', svgHeight);
    xAxis.setAttribute('x2', svgWidth);
    xAxis.setAttribute('y2', svgHeight);
    xAxis.setAttribute('stroke', 'black');
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', svgHeight);
    yAxis.setAttribute('stroke', 'black');
    svg.appendChild(yAxis);
}

function createDiagrammeCircle(params) {
    const percentages = [20, 20, 20, 20, 10, 10];

    // Centre du SVG
    const centerX = 300;
    const centerY = 300;

    // Rayon du cercle
    const radius = 150;

    // Tableau de couleurs
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00', '#00ffff'];

    // Calculer la somme des pourcentages
    const totalPercentage = percentages.reduce((sum, percentage) => sum + percentage, 0);

    // Création des triangles avec couleurs et étiquettes répartis équitablement autour du cercle
    let startAngle = 0;
    for (let i = 0; i < percentages.length; i++) {
        const angle = (360 / totalPercentage) * percentages[i];
        const radians = (startAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(radians);
        const y1 = centerY + radius * Math.sin(radians);

        const x2 = centerX + radius * Math.cos(radians + angle * Math.PI / 180);
        const y2 = centerY + radius * Math.sin(radians + angle * Math.PI / 180);

        const x3 = centerX;
        const y3 = centerY;

        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        triangle.setAttribute('points', `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
        triangle.setAttribute('fill', colors[i]);
        triangle.setAttribute('stroke', colors[i]);
        document.getElementById('circulaire').appendChild(triangle);

        // Ajouter une étiquette pour chaque axe
        const labelAngle = startAngle + angle / 2;
        const labelX = centerX + (radius + 20) * Math.cos(labelAngle * Math.PI / 180);
        const labelY = centerY + (radius + 20) * Math.sin(labelAngle * Math.PI / 180);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.textContent = `Axe ${i + 1} (${percentages[i]}%)`;
        document.getElementById('circulaire').appendChild(label);

        // Mettre à jour l'angle de départ pour le prochain triangle
        startAngle += angle;
    }
}

var bar = `<svg width="400" height="600">
            <rect x="50" y="50" width="100" height="500" fill="blue" />
            <rect x="175" y="75" width="100" height="475" fill="red" />
            <rect x="300" y="200" width="100" height="350" fill="green" />
            </svg>`

content.innerHTML = `
                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-5 ">
                        <h1 class="h3 mb-0 text-gray-800 mt-5">Welcome, ${parsedData.data.user[0].firstName + " " + parsedData.data.user[0].lastName}!</h1>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm logoutButton"><i
                                class="fas fa-download fa-sm text-white-50"></i>Deconnexion</a>
                    </div>
                    <!-- Content Row -->
                    <div class="row vh-50 ">
                        <!-- Earnings (Monthly) Card Example -->
                        <div class="col-xl-4 col-md-6 mb-4">
                            <div class="card border-left-primary shadow h-100 py-2">
                                <div class="no-gutters align-items-center h-100"> <!-- Ajoutez la classe h-100 ici -->
                                    <h4>email: ${parsedData.data.user[0].email}</h4>
                                    <h2>login: ${parsedData.data.user[0].login}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card border-left-primary shadow h-100 py-2 d-flex justify-content-center">
                                <div class="row no-gutters d-flex justify-content-center"> 
                                    <h1 class="">Level ${parsedData.data.level[0].amount}</h1>
                                </div>
                            </div>
                        </div>
                        <!-- Earnings (Monthly) Card Example -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card border-left-primary shadow h-100 py-2 d-flex justify-content-center">
                                <div class="row no-gutters d-flex justify-content-center">
                                    <h1 class="fs-1">${nbrXp} kb</h1>
                                </div>
                            </div>
                        </div>
                        <!-- Earnings (Monthly) Card Example -->
                    <div class="col-xl-12 h-300 row">
                        <div class="col-xl-7 h-100 col-lg-7">
                            <div class="card shadow mb-4">
                                <!-- Card Header - Dropdown -->
                                <div
                                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 font-weight-bold text-primary">Diagramme en bar, nombre de xp par projet</h6>
                                </div>
                                <svg class="bar-chart" width="800" height="600"></svg>
                            </div>
                        </div>
                        <div class="col-xl-5 col-lg-5">
                            <div class="card shadow mb-4 d-flex flex-column align-items-center">
                                <div class="card-header py-3 d-flex flex-row align-items-center col">
                                    <h6 class="m-0 font-weight-bold text-primary">Diagramme en ligne, progression du talent en fonction du temps</h6>
                                </div>
                                <div id="chart_div"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Content Row -->
                    </div>
`

const container = document.getElementById('content')

//console.log(content);
container.appendChild(content)

createDiagrammeBar()

function redirectToLogin() {
    window.location.href = 'login.html';
    localStorage.setItem("data", '')
}

// Écouteur d'événement pour le bouton de déconnexion
const logoutButton = content.querySelector('.logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', redirectToLogin);
}

function formatData(data) {
    data.forEach
}

function formatDate(inputDate) {
    const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    const date = new Date(inputDate);
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2); // Récupère les deux derniers chiffres de l'année
    const day = date.getDate();

    return `${month} ${year}`;
}

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(() => {
    // Appelez votre fonction de génération de graphique ici
    drawBackgroundColor(parsedData.data.progress);
});

function drawBackgroundColor(data) {
    // Convertir les dates en format 'mois yy'
    var Y = 0
    const formattedData = data.map((entry, index) => [
        formatDate(entry.createdAt),
        Y += Math.round(entry.amount)
    ]);
    console.log(formattedData);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Date');
    dataTable.addColumn('number', 'Amount');
    // Ajouter les lignes de données formatées
    dataTable.addRows(formattedData);
    var options = {
        hAxis: {
            title: 'Date'
        },
        vAxis: {
            title: 'Amount (in bit)'
        },
        backgroundColor: '#f1f8e9'
    };
    var SvgElement = document.getElementById('chart_div')
    SvgElement.style.height = '600px'
    SvgElement.style.width = '600px'
    var chart = new google.visualization.LineChart(SvgElement);
    chart.draw(dataTable, options);
}
