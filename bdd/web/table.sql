
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
create table login_cars
(
    id int identity(1,1) primary key not null,
    nom_car_login nvarchar(max) not null,
    mot_de_passe nvarchar(max) not null
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
--new============================================================================
-- alter table carte_carburants add import_pdf VARBINARY(MAX);
--carte carburants contrat
create table carte_carburants
(
    id int identity(1,1) primary key not null,
    nom_prestataire nvarchar(max),
    contrat_type nvarchar(max), --contractuelle , extra
    numero_facture nvarchar(max),
    date_emission datetime,
    carburants decimal(10,2),
    import_pdf VARBINARY(MAX) --par exemple import.pdf
);


--contrat uniforme
create table prestataire_contrat
(
    id int identity(1,1) primary key not null,
    nom_prestataire nvarchar(max),
    contrat_type nvarchar(255), --contractuelle , extra contractuelle
    numero_facture nvarchar(max), --référence par numéro facture group by where numéro_facture
    date_emission datetime,
    designation nvarchar(max),
    nbr_vehicule int,
    nbr_jour int,
    prix_unitaire decimal(10,2)
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