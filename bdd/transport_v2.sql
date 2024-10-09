--gestion car, axe(route), usager, point de ramassage
--database name : ravinala

--mdp haché
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- putch / cutch
--users
create table login
(
    id serial primary key not null,
    nom varchar(100) not null,
    mail varchar(150) not null,
    mot_de_passe varchar(200) not null,
    est_admin boolean default false
);

INSERT INTO login (nom, mail, mot_de_passe, est_admin)
VALUES ('tanjona', 'tanjona@ravinala.com',  '$2a$06$R7ZwO.ELyR2I2gh6MUBuu.tqwP5w5tdV3lo5Z9Q80dGYgkcYjI44S' , true);

INSERT INTO login (nom, mail, mot_de_passe)
VALUES ('tanjona', 'tanjona@ravinala.com', crypt('tanjona', gen_salt('bf')));

INSERT INTO login (nom, mail, mot_de_passe)
VALUES ('toavina', 'toavina@example.com', crypt('toavina', gen_salt('bf')));


-- usagers=======================================================
create table poste 
(
    id serial primary key not null,
    poste varchar(100) not null --stagiaire, AF, RH, etc...
);

insert into poste(poste) values('RH'),('DSI'),('DAF'),('stagiaire');

--le poste où il serait rataché 
create table departement
(
    id serial primary key not null,
    departement varchar(100)
);
insert into departement (departement) values('DJA'),
('DQRSE'),
('DOP'),
('DGA'),
('DRH'),
('DSI'),
('DAF');


create table genre 
(
    id serial primary key not null,
    genre varchar(10) not null
);

insert into genre(genre) values('Homme'),('Femme');

create table usagers
(
    id serial primary key not null,
    matricule varchar(50) UNIQUE not null,
    nom varchar(100) not null,
    date_naissance date not null,
    contact text not null, --au cas si elle possède plusieurs contact -> ex : 034 01 123 24 / 033 22 222 22 / etc...
    mail_ravinala varchar(150) not null,
    genre_id int REFERENCES genre(id),
    poste_id int REFERENCES poste(id),
    departement_id int REFERENCES departement(id)
);

-- Insertion d'un usager Homme avec le poste RH
INSERT INTO usagers (matricule, nom, date_naissance, contact, mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT001', 'John Doe', '1985-03-12', '034 01 123 24 / 033 22 222 22', 'john@ravinala.com', 1, 1, 6);

-- Insertion d'une usagère Femme avec le poste Stagiaire
INSERT INTO usagers (matricule, nom, date_naissance, contact, mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT002', 'Marless', '1990-07-25', '034 55 666 77', 'marless@ravinala.com', 2, 4, 7);

--cars ==========================================
create table type_car
(
    id serial primary key not null,
    type_car varchar(150)
);


create table prestataire
(
    id serial primary key not null,
    prestataire text not null,
    debut_contrat date,
    fin_contrat date 
);

-- insert into prestataire (prestataire) values ('p1');
-- insert into prestataire (prestataire) values ('p2');


create table prestataire_archive
(
    id serial primary key not null,
    prestataire text not null,
    debut_contrat date,
    fin_contrat date,
    prestataire_id int,
    CONSTRAINT fk_prestataire FOREIGN KEY (prestataire_id)
    REFERENCES prestataire(id)
    ON DELETE SET NULL
);
-- insert into prestataire_archive (prestataire, prestataire_id) values ('p1',1);
-- insert into prestataire_archive (prestataire, prestataire_id) values ('p2',2);



create table cars
(
    id serial primary key not null,
    nom_car varchar(150) not null,
    immatriculation varchar(10) not null,
    nombre_place int not null,
    prestataire_id int REFERENCES prestataire(id),
    type_car_id int REFERENCES type_car(id)
);


--conducteurs ===================================================
create table conducteurs
(
    id serial primary key not null, 
    nom varchar(100) not null,
    date_naissance date not null,
    adresse text not null,
    contact  text not null, --au cas si elle possède plusieurs contact -> ex : 034 01 123 24 / 033 22 222 22 / etc...
    mail varchar(150)
);


--route axe =================================
create table axe 
(
    id serial primary key not null,
    axe text not null
);

create table axe_conducteurs
(
    id serial primary key not null,
    axe_id int REFERENCES axe(id),
    conducteurs_id int REFERENCES conducteurs(id),
    cars_id int REFERENCES cars(id)
);


--point de rammassage et depot usagers ============================
--planning calendrier
--en cas de nouveau usagers car mbola tsy fantatra ny heure de depot
--pull data
--date référence
create table axe_usagers_ramassage
(
    id serial primary key not null,
    lieu text not null,
    heure_ramassage time not null,
    usagers_id int REFERENCES usagers(id),
    axe_conducteurs_id int REFERENCES axe_conducteurs(id)
);

create table axe_usagers_depot
(
    id serial primary key not null,
    lieu text not null,
    heure_depot time not null,
    usagers_id int REFERENCES usagers(id),
    axe_conducteurs_id int REFERENCES axe_conducteurs(id)
);
-- React JS, dotnet c#, laravel, spring boot, python, postgreSQL, SQLserver, ORACLE, MySQL
--push data ===================================================
--1 fichier 
create table pointage_usagers_ramassage
(
    id serial primary key not null,
    date_pointage date,
    heure_pointage time,
    heure_depart time, -- btn départ
    heure_arrivee time, -- btn arrivee 
    axe_usagers_ramassage_id int REFERENCES axe_usagers_ramassage(id)
);

--1 fichier
create table pointage_usagers_depot
(
    id serial primary key not null,
    date_pointage date,
    heure_pointage time,
    heure_depart time, -- btn départ
    heure_arrivee time, -- btn arrivee 
    axe_usagers_depot_id int REFERENCES axe_usagers_depot(id)
);

create table push_week
(
    id serial primary key not null,
    date_push date,
    heure_push time,
    pointage_usagers_ramassage_id int REFERENCES pointage_usagers_ramassage(id),
    pointage_usagers_depot_id int REFERENCES pointage_usagers_depot(id)
);

create table save_push
(
    id serial primary key not null,
    date_save_push date,
    heure_save_push time,
    push_week_id int REFERENCES push_week(id)
);

--archivage contrat prestataire