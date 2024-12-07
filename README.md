# Projet Web Mapping avec OpenLayers et Node.js

# Réalisé par :   Malek Elmechi et Fatma Krichen

# Encadré par :   Mr Riadh Tebourbi

# Introduction

Ce projet est une application de cartographie interactive utilisant OpenLayers pour afficher et manipuler des données géographiques.

Les données des géométries (points, lignes, polygones) dessinées par les utilisateurs sont sauvegardées dans une base de données PostgreSQL avec l'extension PostGIS, offrant des capacités avancées de gestion spatiale.

# L'objectif est de permettre aux utilisateurs de :

- Dessiner des points, des lignes, et des polygones sur une carte.
- Localiser leur position actuelle via le GPS.
- Sauvegarder les géométries dessinées dans une base de données géospatiale.

# Fonctionnalités

- Localisation utilisateur : Récupère et affiche la position GPS actuelle de l'utilisateur sur la carte.
- Dessiner des géométries : Point : Ajouter un point ponctuel.
- Ligne : Tracer une ligne simple connectant deux points.
- Polygone : Dessiner une surface fermée avec plusieurs sommets.
- Sauvegarde sur PostgreSQL/PostGIS : Les géométries sont sauvegardées dans une base de données avec leur type et leurs coordonnées.
- Affichage interactif : Basé sur OpenLayers pour des interactions fluides et une navigation intuitive.

# Technologies Utilisées

1- Frontend : HTML5, CSS3, JavaScript avec OpenLayers.
2- Backend : Node.js avec Express.js pour la gestion des API REST.
3- PostgreSQL avec PostGIS pour le stockage et la gestion des données spatiales.

# Captures d'écran

(Images/capture1.png)

1. Localisation utilisateur

(Images/capture2.png)

2. Dessin de Point - Dessin de Ligne - Dessin de Polygone

(Images/capture3.png)

(Images/DESSINTOUT.png)

3. Démonstration du Backend avec Postman

(pdf_name)
