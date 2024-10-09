--C:\Users\Bruner Lee Rudy\OneDrive\Documents\SQL Server Management Studio

-- sqlcmd -S DESKTOP-TIMRU9I\SQLEXPRESS -E

--users
CREATE TABLE login
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    nom NVARCHAR(100) NOT NULL,
    mail NVARCHAR(150) NOT NULL,
    mot_de_passe NVARCHAR(200) NOT NULL,
    est_admin BIT DEFAULT 0  --1 : admin , 0 : non admin
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
    date_naissance DATE NOT NULL,
    contact NVARCHAR(MAX) NOT NULL, -- au cas où plusieurs contacts
	adresse NVARCHAR(MAX) not null,
    mail_ravinala NVARCHAR(150) NOT NULL,
    genre_id INT FOREIGN KEY REFERENCES genre(id),
    poste_id INT FOREIGN KEY REFERENCES poste(id),
    departement_id INT FOREIGN KEY REFERENCES departement(id)
);


--ALTER TABLE usagers
--adresse NVARCHAR(MAX);

--==========================================================================

CREATE TABLE type_cars
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    type_cars NVARCHAR(150)
);

CREATE TABLE prestataire
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    prestataire NVARCHAR(MAX) NOT NULL,
    debut_contrat DATE,
    fin_contrat DATE
);

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
    type_cars_id INT FOREIGN KEY REFERENCES type_cars(id)
);

--conducteurs ===================================================
CREATE TABLE conducteurs
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL, 
    nom NVARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    adresse NVARCHAR(MAX) NOT NULL,
    contact NVARCHAR(MAX) NOT NULL, -- plusieurs contacts possibles
    mail NVARCHAR(150)
);

--route axe=================================
CREATE TABLE axe
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    axe NVARCHAR(MAX) NOT NULL
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
	est_actif bit default 0,
    usagers_id INT FOREIGN KEY REFERENCES usagers(id),
    axe_id INT FOREIGN KEY REFERENCES axe(id),
);

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
	est_actif bit default 0,
    usagers_id INT FOREIGN KEY REFERENCES usagers(id),
    axe_id INT FOREIGN KEY REFERENCES axe(id),
);

--pointage usagers ramassage
CREATE TABLE pointage_usagers_ramassage
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_pointage DATE,
    heure_pointage TIME, --btn départ
    heure_depart TIME, --btn arriver
    heure_arrivee TIME,
    axe_usagers_ramassage_id INT FOREIGN KEY REFERENCES axe_usagers_ramassage(id)
);

--pointage usagers depot
CREATE TABLE pointage_usagers_depot
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    date_pointage DATE,
    heure_pointage TIME, --btn départ
    heure_depart TIME, --btn arriver
    heure_arrivee TIME,
    axe_usagers_depot_id INT FOREIGN KEY REFERENCES axe_usagers_depot(id)
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
