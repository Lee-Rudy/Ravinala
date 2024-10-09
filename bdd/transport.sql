--database name : ravinala
--type : postgresql


--users--------------------------

create table utilisateurs
(
    id serial primary key not null,
    nom varchar(100) not null,
    mail varchar(150) not null,
    mot_de_passe varchar(200) not null,
    statut boolean default false
);

-- tablette ----------------------
--Gestion des cars / usagers

-- administrateur ----------------------
--Gestion des cars / usagers

create table type_car
(
    id serial primary key not null,
    type_car text,--(fret, support, decalé)
);

create table prestataire 
(
    id serial primary key not null,
    prestataire text not null
);

create table cars
(
    id serial primary key not null,
    nom_car varchar(25) not null,
    immatriculation varchar(10) not null,
    nombre_place int not null,
    type_car_id int REFERENCES type_car(id),
    prestataire_id int REFERENCES prestataire(id)
);

create table conducteurs 
(
    id serial primary key not null, 
    nom varchar(100) not null,
    date_naissance date not null,
    adresse text not null,
    contact  text not null, --au cas si elle possède plusieurs contact -> ex : 034 01 123 24 / 033 22 222 22 / etc...
    mail varchar(150)
);

create table genre 
(
    id serial primary key not null,
    genre varchar(10) not null,
);

create table poste 
(
    id serial primary key not null,
    poste varchar(100) not null --stagiaire, DAF, RH, etc...
);

-- insert into usagers_presence (etat) values (0),(1);

create table usagers
(
    id serial primary key not null,
    matricule varchar(50) not null,
    nom varchar(100) not null,
    date_naissance date not null,
    contact text not null, --au cas si elle possède plusieurs contact -> ex : 034 01 123 24 / 033 22 222 22 / etc...
    etat varchar(50), --active (prendre le car) non active(prend pas le car)
    mail_ravinala varchar(150),
    genre_id int REFERENCES genre(id),
    poste_id int REFERENCES poste(id)
);

--Gestion des attributions
--attributions 
create table attribution_cars_conducteurs
(
    id serial primary key not null,
    date_attribution date,
    conducteurs_id int REFERENCES conducteurs(id),
    cars_id int REFERENCES cars(id)
);

create table attribution_cars_usagers
(
    id serial primary key not null,
    usagers_id int REFERENCES usagers(id),
    cars_id int REFERENCES cars(id)
);

--ramassage et dépôt
create table heure_lieu
(
    id serial primary key not null,
    rammassage_matin text,
    heure_ramassage_matin time,
    depot_matin text,
    heure_depot_matin time,
    rammassage_soir text,
    heure_ramassage_soir time,
    depot_soir text,
    heure_depot_soir time,
    usagers_id int REFERENCES usagers(id) ON DELETE CASCADE,
);

--========================= calendrier suivi de ramassage
--axe du trajet
--route
create table axe
(
    id serial primary key not null,
    nom_axe text not null,
);

create table planning
(
    id serial primary key not null,
    planning varchar (100) --matin, soir, teambuilding , etc... (CRUD)
);

--trier par plannig_id ny liste aveo 
--sy par axe et ordre by heure de rammassage
--pull mis à jour
--pour la tablette
create table planning_passagers
(
    id serial primary key not null,
    planning_id int REFERENCES planning(id),
    axe_id int REFERENCES axe(id),
    heure_lieu_id int REFERENCES heure_lieu(id),
    attribution_cars_usagers_id int REFERENCES attribution_cars_usagers(id),
    attribution_cars_conducteurs_id int REFERENCES attribution_cars_conducteurs(id)
);


--push day / week
--isakin'inona no mipush ??

--hafaka mipush na 
--rehefa mipush vao miasa ito table ito
create table push_week 
(
    id serial primary key no null,
    planning_passagers_id int REFERENCES planning_passagers(id),
    date_pointage date,
    heure_rammassage_depot time,
);

create table save_push
(
    id serial primary key not null,
    date_save_valide date,
    push_week_id int REFERENCES push_week(id)
);

--archivage et sauvgarde de donnée, contract prestataire 
--table supprimer_collaborateur --> insert  


create table supprimer_collaborateur
(
    id serial primary key not null,
    heure_lieu_id int REFERENCES heure_lieu(id)
);






-----------------------------------------------------------------------------------

--heure matin 
-- create table planning_passagers_matin
-- (
--     id serial primary key not null
--     axe_id REFERENCES axe(id),
--     heure_lieu_id REFERENCES heure_lieu(id),
--     usagers_presence_id REFERENCES usagers_presence(id),
--     attribution_cars_usagers_id REFERENCES attribution_cars_usagers(id),
--     attribution_cars_conducteurs_id REFERENCES attribution_cars_conducteurs(id)
-- );

--heure soir 
-- create table planning_passagers_soir
-- (
--     id serial primary key not null
--     axe_id REFERENCES axe(id),
--     heure_lieu_id REFERENCES heure_lieu(id),
--     usagers_presence_id REFERENCES usagers_presence(id),
--     attribution_cars_usagers_id REFERENCES attribution_cars_usagers(id),
--     attribution_cars_conducteurs_id REFERENCES attribution_cars_conducteurs(id)
-- );

-----------------------------------------------------------------------------------