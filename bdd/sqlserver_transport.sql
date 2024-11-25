--C:\Users\Bruner Lee Rudy\OneDrive\Documents\SQL Server Management Studio

-- sqlcmd -S DESKTOP-TIMRU9I\SQLEXPRESS -E


--vider les insertions da la base de donnée:
TRUNCATE TABLE nom_de_ta_table;
--ou
-- Désactiver temporairement les contraintes de clé étrangère
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';

-- Truncate ou Delete toutes les tables
EXEC sp_MSforeachtable 'TRUNCATE TABLE ?';

-- Réactiver les contraintes de clé étrangère
EXEC sp_MSforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL';



--users
CREATE TABLE login
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    nom NVARCHAR(100) NOT NULL,
    mail NVARCHAR(150) NOT NULL,
    mot_de_passe NVARCHAR(200) NOT NULL,
    est_admin BIT DEFAULT 0  --1 : admin , 0 : non admin
);

--login mobile cars
--tsy maintsy mitovy @ nom_car ny login ; ny mdp tsy voatery
create login_cars
(
    id int identity(1,1) primary key not null,
    nom_car_login nvarchar(100) not null,
    mot_de_passe(50) not null
);


-- usagers=======================================================
CREATE TABLE poste 
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    poste NVARCHAR(100) NOT NULL -- stagiaire, AF, RH, etc...
);


--le poste où il serait rattaché
CREATE TABLE departement
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    departement NVARCHAR(100)
);


CREATE TABLE genre 
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    genre NVARCHAR(10) NOT NULL
);


CREATE TABLE usagers
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    matricule NVARCHAR(50) UNIQUE NOT NULL,
    nom NVARCHAR(100) NOT NULL,
    prenom NVARCHAR(100) NOT NULL,
    contact NVARCHAR(MAX) NOT NULL, -- au cas où plusieurs contacts
	adresse NVARCHAR(MAX) not null,
    mail_ravinala NVARCHAR(150),
    genre_id INT FOREIGN KEY REFERENCES genre(id),
    poste_id INT FOREIGN KEY REFERENCES poste(id),
    departement_id INT FOREIGN KEY REFERENCES departement(id)
);

--en service / hors service

-- ALTER TABLE usagers
-- ADD en_service BIT NOT NULL DEFAULT 1;

-- UPDATE usagers
-- SET en_service = 1;


-- select lieu,fokontany,district from axe_usagers_ramassage where axe_id = 2;
--------------------------------------------------------------
-- SELECT a.lieu, 
--        a.district, 
--        a.fokontany, 
--        u.nom, 
--        u.matricule
-- FROM axe_usagers_ramassage a
-- JOIN usagers u ON a.usagers_id = u.id
-- WHERE a.axe_id = 2;

--------------------------------------------------------------
-- SELECT a.lieu, 
--        a.district, 
--        a.fokontany, 
--        u.nom, 
--        u.matricule,
-- 	   ax.axe,
-- 	   ax.duree_trajet,
-- 	   ax.distance_km
-- FROM axe_usagers_ramassage a
-- JOIN usagers u ON a.usagers_id = u.id
-- JOIN axe ax ON a.axe_id =ax.id 
-- WHERE a.axe_id = 1;
--------------------------------------------------------------


-- ALTER TABLE usagers
-- ALTER COLUMN mail_ravinala NVARCHAR(150) NULL;

-- ALTER TABLE usagers
-- DROP COLUMN date_naissance;

-- ALTER TABLE usagers add prenom NVARCHAR(100) not null;
-- ALTER TABLE usagers alter column prenom NVARCHAR(100) not null;

--ALTER TABLE usagers
--adresse NVARCHAR(MAX);

--==========================================================================

CREATE TABLE type_cars
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    type_cars NVARCHAR(150)
);

--prestataire actuel
CREATE TABLE prestataire
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    prestataire NVARCHAR(MAX) NOT NULL,
    debut_contrat DATE,
    fin_contrat DATE
);

--copie de prestataire
CREATE TABLE prestataire_archive
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    prestataire NVARCHAR(MAX) NOT NULL,
    debut_contrat DATE,
    fin_contrat DATE,
    prestataire_id INT FOREIGN KEY REFERENCES prestataire(id) ON DELETE SET NULL
);


CREATE TABLE cars
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    nom_car NVARCHAR(150) NOT NULL,
    immatriculation NVARCHAR(10) NOT NULL,
    nombre_place INT NOT NULL,
    prestataire_id INT FOREIGN KEY REFERENCES prestataire(id),
    type_cars_id INT FOREIGN KEY REFERENCES type_cars(id),
    est_actif bit default 1, --new fait
    litre_consommation decimal(10,2), -- new fait
    km_consommation decimal(10,2), -- new fait
    prix_consommation decimal(10,2), -- new fait
    type_carburant nvarchar(MAX) -- new fait
);

-- UPDATE nom_table
-- SET colonne1 = valeur1, colonne2 = valeur2, ...
-- WHERE condition;


-- ALTER TABLE cars
-- ADD litre_consommation decimal,
--     km_consommation decimal,
--     prix_consommation decimal,
--     type_carburant nvarchar(max);


-- ALTER TABLE cars add est_actif bit default 1;
--alter table cars drop column distance_km;

--for statistique 
create table historique_consommation_cars --new
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_consommation date,
    litre_consommation decimal(10,2), 
    km_consommation decimal(10,2),
    prix_consommation decimal(10,2),
    type_carburant varchar(MAX),
    cars_id int foreign key references cars(id) ON DELETE SET NULL,
    prestataire NVARCHAR(MAX) NOT NULL,
    debut_contrat DATE,
    fin_contrat DATE,
    axe_id int foreign key references axe(id) ON DELETE SET NULL,
    axe NVARCHAR(MAX) NOT NULL,
    duree_trajet int, --minutes ex: 180minutes
    distance_km decimal(10,2)
);


--conducteurs ===================================================
CREATE TABLE conducteurs
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL, 
    nom NVARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    adresse NVARCHAR(MAX) NOT NULL,
    contact NVARCHAR(MAX) NOT NULL, -- plusieurs contacts possibles
    mail NVARCHAR(150),
    est_actif bit default 1
);
-- ALTER TABLE conducteurs add est_actif bit default 1;


--route axe=================================
CREATE TABLE axe
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    axe NVARCHAR(MAX) NOT NULL,
    duree_trajet int, --minutes ex: 180minutes
    distance_km decimal(10,2)
);
-- ALTER TABLE axe add duree_trajet int;
-- ALTER TABLE axe add distance_km decimal(10,2);


-- UPDATE axe
-- SET duree_trajet = @duree_trajet, kilometrage = @kilometrage
-- WHERE id = @id;

-- update axe
-- set axe = 'axe2' 
-- where id = 2;

CREATE TABLE axe_conducteurs
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    axe_id INT FOREIGN KEY REFERENCES axe(id),
    conducteurs_id INT FOREIGN KEY REFERENCES conducteurs(id),
    cars_id INT FOREIGN KEY REFERENCES cars(id)
);

--point de rammassage et depot usagers============================
CREATE TABLE axe_usagers_ramassage
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    lieu NVARCHAR(MAX) NOT NULL,
    heure_ramassage TIME NOT NULL,
	est_actif bit default 1,
    district NVARCHAR(MAX),
    fokontany NVARCHAR(MAX),
    usagers_id INT FOREIGN KEY REFERENCES usagers(id),
    axe_id INT FOREIGN KEY REFERENCES axe(id),
);

-- ALTER TABLE axe_usagers_ramassage
-- ADD district NVARCHAR(MAX) NOT NULL,
--     fokontany NVARCHAR(MAX) NOT NULL;

--0 : non actif, 1 : actif
--alter table axe_usagers_ramassage
--add est_actif bit default 0;

--alter table axe_usagers_depot
--add est_actif bit default 0;

CREATE TABLE axe_usagers_depot
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    lieu NVARCHAR(MAX) NOT NULL,
    heure_depot TIME NOT NULL,
	est_actif bit default 1,
    district NVARCHAR(MAX),
    fokontany NVARCHAR(MAX),
    usagers_id INT FOREIGN KEY REFERENCES usagers(id),
    axe_id INT FOREIGN KEY REFERENCES axe(id),
);

-- ALTER TABLE axe_usagers_depot
-- ADD district NVARCHAR(MAX) NOT NULL,
--     fokontany NVARCHAR(MAX) NOT NULL;


--pointage usagers ramassage
CREATE TABLE pointage_usagers_ramassage
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_pointage DATE,
    heure_pointage TIME,
    heure_depart TIME,  --btn départ
    heure_arrivee TIME,--btn arriver
    axe_usagers_ramassage_id INT FOREIGN KEY REFERENCES axe_usagers_ramassage(id),
    kilometrage_debut int, --new fait
    kilometrage_fin int --new fait
);

-- ALTER TABLE pointage_usagers_ramassage
-- ADD kilometrage_debut int,
--     kilometrage_fin int;

-- ALTER TABLE pointage_usagers_depot
-- ADD kilometrage_debut int,
--     kilometrage_fin int;

--pointage usagers depot
CREATE TABLE pointage_usagers_depot
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_pointage DATE,
    heure_pointage TIME,
    heure_depart TIME,  --btn départ
    heure_arrivee TIME,--btn arriver
    axe_usagers_depot_id INT FOREIGN KEY REFERENCES axe_usagers_depot(id),
    kilometrage_debut int, --new fait
    kilometrage_fin int --new fait
);

CREATE TABLE push_week
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_push DATE,
    heure_push TIME,
    pointage_usagers_ramassage_id INT FOREIGN KEY REFERENCES pointage_usagers_ramassage(id),
    pointage_usagers_depot_id INT FOREIGN KEY REFERENCES pointage_usagers_depot(id)
);


CREATE TABLE save_push
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_save_push DATE,
    heure_save_push TIME,
    push_week_id INT FOREIGN KEY REFERENCES push_week(id)
);

-- to see axe with driver and cars

SELECT 
    a.id AS axe_id,
    a.axe AS nom_axe,
    c.id AS conducteur_id,
    c.nom AS nom_conducteur,
    ca.id AS car_id,
    ca.nom_car
FROM 
    axe_conducteurs ac
JOIN 
    axe a ON ac.axe_id = a.id
JOIN 
    conducteurs c ON ac.conducteurs_id = c.id
JOIN 
    cars ca ON ac.cars_id = ca.id
ORDER BY 
    a.axe, c.nom;

planning ramassage / depot where statut est_actif:
 - matricule + nom 
 - axe 
 - cars
 - fokontany + lieu
 - heure (misy order by )

 -> recherche : nom + matricule + fokontany
 -> tri : axe + cars

--planning ramassage
SELECT 
    u.matricule,
    u.nom AS nom_usager,
    a.axe AS nom_axe,
    c.nom_car AS nom_voiture,
    aur.fokontany,
    aur.lieu,
    aur.heure_ramassage AS heure
FROM 
    usagers u
JOIN axe_usagers_ramassage aur ON u.id = aur.usagers_id
JOIN axe a ON aur.axe_id = a.id
JOIN axe_conducteurs ac ON a.id = ac.axe_id
JOIN cars c ON ac.cars_id = c.id
WHERE 
    aur.est_actif = 1
ORDER BY 
    c.nom_car ASC, 
    aur.heure_ramassage ASC;

--table mobile liste ramassage 
--planning ramassage
SELECT 
    u.matricule,
    u.nom AS nom_usager,
    a.axe AS nom_axe,
    c.nom_car AS nom_voiture,
    aur.fokontany,
    aur.lieu,
    aur.heure_ramassage AS heure
FROM 
    usagers u
JOIN axe_usagers_ramassage aur ON u.id = aur.usagers_id
JOIN axe a ON aur.axe_id = a.id
JOIN axe_conducteurs ac ON a.id = ac.axe_id
JOIN cars c ON ac.cars_id = c.id
WHERE 
    aur.est_actif = 1
-- WHERE 
-- aur.est_actif = 1 and ac.cars_id =1
ORDER BY 
    c.nom_car ASC, 
    aur.heure_ramassage ASC;


--planning depot
    SELECT 
    u.matricule,
    u.nom AS nom_usager,
    a.axe AS nom_axe,
    c.nom_car AS nom_voiture,
    aud.fokontany,
    aud.lieu,
    aud.heure_depot AS heure
FROM 
    usagers u
JOIN axe_usagers_depot aud ON u.id = aud.usagers_id
JOIN axe a ON aud.axe_id = a.id
JOIN axe_conducteurs ac ON a.id = ac.axe_id
JOIN cars c ON ac.cars_id = c.id
WHERE 
    aud.est_actif = 1
ORDER BY 
    c.nom_car ASC, 
    aud.heure_depot ASC;


-- SELECT 
--     u.matricule,
--     u.nom AS nom_usager,
--     a.axe AS nom_axe,
--     c.nom_car AS nom_voiture,
--     COALESCE(aur.fokontany, aud.fokontany) AS fokontany,
--     COALESCE(aur.lieu, aud.lieu) AS lieu,
--     COALESCE(aur.heure_ramassage, aud.heure_depot) AS heure,
--     aur.est_actif AS ramassage_actif,
--     aud.est_actif AS depot_actif
-- FROM 
--     usagers u
-- LEFT JOIN axe_usagers_ramassage aur ON u.id = aur.usagers_id AND aur.est_actif = 1
-- LEFT JOIN axe_usagers_depot aud ON u.id = aud.usagers_id AND aud.est_actif = 1
-- LEFT JOIN axe a ON aur.axe_id = a.id OR aud.axe_id = a.id
-- LEFT JOIN axe_conducteurs ac ON a.id = ac.axe_id
-- LEFT JOIN cars c ON ac.cars_id = c.id
-- WHERE 
--     u.matricule IS NOT NULL
-- ORDER BY 
--     a.axe ASC, 
--     c.nom_car ASC, 
--     COALESCE(aur.heure_ramassage, aud.heure_depot) ASC;

--table for tablette mobile en attente
create table push_pointage
(
    id int IDENTITY(1,1) primary key not null,
    cars_id int FOREIGN key REFERENCES cars(id),
    usagers_id int FOREIGN key REFERENCES usagers(id), --liste_id
    heure_pointage time,
    date_pointage date
);

create table push_duree_trajet_cars
(
    id int IDENTITY(1,1) primary key not null,
    cars_id int FOREIGN key REFERENCES cars(id),
    date_duree_pointage date,
    heure_debut time, --btn debut
    heure_fin time --btn fin
);



