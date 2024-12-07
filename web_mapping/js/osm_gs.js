
var url_geoserver =  "http://localhost:8080/geoserver/wms";

//noms des couches
var name_layer_landuse = "formation_gs:gis_osm_landuse";
var name_layer_roads = "formation_gs:gis_osm_roads";
var name_layer_pois = "formation_gs:gis_osm_pois";
var name_layer_places = "formation_gs:gis_osm_places";
var name_layer_civ_adm1 = "formation_gs:civ_adm1";
var name_layer_civ_adm2 = "formation_gs:civ_adm2";
var name_layer_civ_adm3 = "formation_gs:civ_adm3";
var name_layer_Abidjan_HR = "formation_gs:Abidjan_HR_ext";



//déclaration des couches openlayers
var lyr_osm = new ol.layer.Tile({
    title: 'OSM',
    type: 'base',
    visible: true,
    source: new ol.source.OSM()
});

var lyr_landuse = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_landuse, "TILED": "true"}
    })),
    title: "Occupation du sol"
});
var lyr_roads = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_roads, "TILED": "true"}
    })),
    title: "Routes"
});
var lyr_pois = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_pois, "TILED": "true"}
    })),
    title: "POIs"
});
var lyr_places = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_places, "TILED": "true"}
    })),
    title: "Lieux"
});
var lyr_civ_adm1 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_civ_adm1, "TILED": "true"}
    })),
    title: "Adm1"
});
var lyr_civ_adm2 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_civ_adm2, "TILED": "true"}
    })),
    title: "Adm2"
});
var lyr_civ_adm3 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_civ_adm3, "TILED": "true"}
    })),
    title: "Adm3"
});
var lyr_Abidjan_HR = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": name_layer_Abidjan_HR, "TILED": "true"}
    })),
    title: "Abidjan"
});

lyr_landuse.setVisible(true);
lyr_roads.setVisible(true);
lyr_pois.setVisible(true);
lyr_places.setVisible(true);
lyr_civ_adm1.setVisible(true);
lyr_civ_adm2.setVisible(true);
lyr_civ_adm3.setVisible(true);
lyr_Abidjan_HR.setVisible(true);


var layersList = [lyr_osm,lyr_landuse,lyr_roads,lyr_pois,lyr_places,lyr_civ_adm1,lyr_civ_adm2,lyr_civ_adm3,lyr_Abidjan_HR];

var mapView = new ol.View({
    projection: 'EPSG:3857',
    center: new ol.geom.Point([-5.690183, 7.786829]).transform('EPSG:4326',
        'EPSG:3857').getCoordinates(),
    zoom: 7
});

var overlayPopup = new ol.Overlay({
    element: container
});

var map = new ol.Map({
    target: 'map',
    overlays: [overlayPopup],
    layers: layersList,
    view: mapView
});

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Légende'
});
var ScaleLine = new ol.control.ScaleLine({
    units: 'metric'
});
var MousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326'
});


var clicked_coord;
var onSingleClick = function(evt) {
    var coord = evt.coordinate;
    console.log(coord);
    var source1 = name_layer_civ_adm1;
    var source2 = name_layer_civ_adm2;
    var source3 = name_layer_civ_adm3;
    var layers_list = source3 + ',' + source2 + ',' + source1;
    var wmslyr_adm1 = new ol.source.TileWMS({
        url: url_geoserver,
        params: {'LAYERS': name_layer_civ_adm1, 'TILED': true},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });
    var view = map.getView();
    var viewResolution = view.getResolution();
    var url=wmslyr_adm1.getFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        {
            'INFO_FORMAT': 'text/javascript',
            'FEATURE_COUNT': 20,
            'LAYERS':  layers_list,
            'QUERY_LAYERS': layers_list
        });
    console.log(url);
    if (url) { //call parseResponse(data)
        clicked_coord = coord;
        $.ajax(url,
            {dataType: 'jsonp'}
        ).done(function (data) {
            });
    }
}
function parseResponse(data) {
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(data)
    });
    console.log((new ol.format.GeoJSON()).readFeatures(data));
    var features = vectorSource.getFeatures();
    var str="";
    var district = "";
    var region = "";
    var departement = "";
    for(x in features) {
        var id = features[x].getId();
        console.log(id);
        var props = features[x].getProperties();
        if(id.indexOf("adm1")>-1) district = props["ADM1_FR"];
        if(id.indexOf("adm2")>-1) region = props["ADM2_FR"];
        if(id.indexOf("adm3")>-1) departement = props["ADM3_FR"];
    }
    str = str + "District: " + district+ '<br/>';
    str = str + "Région: " + region+ '<br/>';
    str = str + "Département: " + departement+ '<br/>';
    if(str) {
        str = '<p>' + str + '</p>';
        overlayPopup.setPosition(clicked_coord);
        content.innerHTML = str;
        container.style.display = 'block';
    }
    else{
        container.style.display = 'none';
        closer.blur();
    }
}


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');



map.addControl(layerSwitcher);
map.addControl(MousePosition);
map.addControl(ScaleLine);

map.on('pointermove', function(event) {
    var coord3857 = event.coordinate;
    var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
    $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 5));
});




map.on('singleclick', function(evt) {
    onSingleClick(evt);
});

closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};




var point = new ol.geom.Point(
    ol.proj.transform([-5.690183, 7.786829], 'EPSG:4326', 'EPSG:3857')
);
var circle = new ol.geom.Circle(
    ol.proj.transform([-5.690183, 7.786829], 'EPSG:4326', 'EPSG:3857'),
    450000
);


var pointFeature = new ol.Feature(point);
var circleFeature = new ol.Feature(circle);


var vectorSource = new ol.source.Vector({
    projection: 'EPSG:4326'
});
vectorSource.addFeatures([pointFeature, circleFeature]);

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.addLayer(vectorLayer);

var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 100, 50, 0.3)'
    }),
    stroke: new ol.style.Stroke({
        width: 2,
        color: 'rgba(255, 100, 50, 0.8)'
    }),
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(55, 200, 150, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            width: 1,
            color: 'rgba(55, 200, 150, 0.8)'
        }),
        radius: 7
    })
});



var button = $('#pan').button('toggle');
var interaction;
$('div.btn-group button').on('click', function(event) {
    var id = event.target.id;

    button.button('toggle');
    button = $('#'+id).button('toggle');

    map.removeInteraction(interaction)
    switch(event.target.id) {
        case "select":
            interaction = new ol.interaction.Select();
            map.addInteraction(interaction);
            break;
        case "point":
            interaction = new ol.interaction.Draw({
                type: 'Point',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "line":
            interaction = new ol.interaction.Draw({
                type: 'LineString',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "polygon":
            interaction = new ol.interaction.Draw({
                type: 'Polygon',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "modify":
            interaction = new ol.interaction.Modify({
                features: new ol.Collection(vectorLayer.getSource().getFeatures())
            });
            map.addInteraction(interaction);
            break;
        default:
            break;
    }
});

interaction = new ol.interaction.Draw({
    type: 'Point',
    source: vectorLayer.getSource()
});


var geolocation = new ol.Geolocation({
    projection: map.getView().getProjection(),
    tracking: true
});
var marker = new ol.Overlay({
    element: document.getElementById('location'),
    positioning: 'center-center'
});
map.addOverlay(marker);
geolocation.on('change:position', function() { //real time tracking
    map.getView().setCenter(geolocation.getPosition());
    map.getView().setZoom(15);
    marker.setPosition(geolocation.getPosition());
});

function zoomToMyPosition() {
    var position = geolocation.getPosition();
    if (position) {
        map.getView().setCenter(position);
        map.getView().setZoom(15);
    } else {
        alert("Impossible de récupérer la position de l'utilisateur.");
    }
}


function goToFullExtent() {
    var extent = map.getView().calculateExtent(map.getSize());
    map.getView().fit(extent, { duration: 1000 });
    map.getView().setZoom(2); //
}

// Variables globales pour gérer le type de dessin et l'interaction actuelle
var featureType = null;
var currentDrawInteraction = null; // Interaction actuelle

// Vérifiez que vectorLayer est bien initialisé
var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector() // Source pour stocker les géométries dessinées
});

// Ajoutez vectorLayer à la carte (important si ce n'est pas déjà fait)
map.addLayer(vectorLayer);

// Fonction pour initialiser l'interaction de dessin
function setupDrawingInteraction(type) {
    // Supprimer l'ancienne interaction de dessin si elle existe
    if (currentDrawInteraction) {
        map.removeInteraction(currentDrawInteraction);
    }

    // Mettre à jour le type de géométrie
    featureType = type;

    // Créer une nouvelle interaction de dessin pour le type spécifié
    currentDrawInteraction = new ol.interaction.Draw({
        type: featureType, // Le type de géométrie : "Point", "LineString", ou "Polygon"
        source: vectorLayer.getSource(), // Où stocker la géométrie dessinée
        maxPoints: type === 'LineString' ? 2 : undefined // Limiter à 2 points pour une ligne
    });

    // Gérer l'événement 'drawend' (fin du dessin)
    currentDrawInteraction.on('drawend', function(event) {
        var feature = event.feature; // Récupérer la feature dessinée
        var geometry = feature.getGeometry(); // Récupérer la géométrie dessinée

        console.log('Géométrie dessinée :', geometry); // Debugging dans la console

        // Envoyer la géométrie au backend pour la sauvegarde
        sendGeometryToBackend(geometry, featureType);
    });

    // Ajouter la nouvelle interaction à la carte
    map.addInteraction(currentDrawInteraction);
}

// Lier les boutons aux interactions de dessin
document.getElementById('point').addEventListener('click', function() {
    setupDrawingInteraction('Point'); // Activer le dessin de Point
});

document.getElementById('line').addEventListener('click', function() {
    setupDrawingInteraction('LineString'); // Activer le dessin de Ligne avec 2 points
});

document.getElementById('polygon').addEventListener('click', function() {
    setupDrawingInteraction('Polygon'); // Activer le dessin de Polygone
});

// Fonction pour envoyer la géométrie au backend
function sendGeometryToBackend(geometry, featureType) {
    // Convertir la géométrie en GeoJSON
    var geoJson = new ol.format.GeoJSON().writeFeature(new ol.Feature(geometry));

    // Ajouter la projection EPSG:4326 au GeoJSON
    var geoJsonWithProjection = JSON.parse(geoJson);
    geoJsonWithProjection.crs = { "type": "name", "properties": { "name": "EPSG:4326" } };

    // Envoyer les données au backend
    fetch('http://localhost:3000/add-feature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            featureType: featureType, // Type de la géométrie (Point, LineString, Polygon)
            geometry: geoJsonWithProjection // Données GeoJSON avec projection
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Géométrie envoyée avec succès :', data);
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi de la géométrie :', error);
    });
}
