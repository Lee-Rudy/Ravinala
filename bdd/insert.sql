-- Note : Utilisez HASHBYTES pour hacher le mot de passe sous SQL Server
--INSERT INTO login (nom, mail, mot_de_passe, est_admin)
--VALUES ('tanjona', 'tanjona@ravinala.com', HASHBYTES('SHA2_256', 'tanjona'), 1);

INSERT INTO login (nom, mail, mot_de_passe, est_admin)
VALUES ('tanjona', 'tanjona@ravinala.com',  '$2a$06$R7ZwO.ELyR2I2gh6MUBuu.tqwP5w5tdV3lo5Z9Q80dGYgkcYjI44S' ,1);

INSERT INTO login (nom, mail, mot_de_passe,est_admin)
VALUES ('toavina', 'toavina@ravinala.com','$2a$06$fk4mrsWb4RK7H8q8ulNkfOg1N/SuFRLfMI1k89S0XLd38EZBb9RrW',0);


--INSERT INTO login (nom, mail, mot_de_passe)
--VALUES ('toavina', 'toavina@ravinala.com', HASHBYTES('SHA2_256', 'toavina'));



------------------------
INSERT INTO poste(poste) VALUES ('RH'), ('DSI'), ('DAF'), ('stagiaire');

-----------------------------
INSERT INTO departement(departement) VALUES ('DJA'),
('DQRSE'),
('DOP'),
('DGA'),
('DRH'),
('DSI'),
('DAF');

--------------------------
INSERT INTO genre(genre) VALUES ('Homme'), ('Femme');

---------------------------
-- Insertion d'un usager Homme avec le poste RH
INSERT INTO usagers (matricule, nom, date_naissance, contact, adresse ,mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT001', 'John Doe', '1985-03-12', '034 01 123 24 / 033 22 222 22', 'adresse','john@ravinala.com', 1, 1, 6);

-- Insertion d'une usagère Femme avec le poste Stagiaire
INSERT INTO usagers (matricule, nom, date_naissance, contact,adresse , mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT002', 'Marless', '1990-07-25', '034 55 666 77', 'adresse','marless@ravinala.com', 2, 4, 7);

INSERT INTO usagers (matricule, nom, date_naissance, contact,adresse , mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT004', 'Rudy', '2002-05-28', '034 61 123 96', 'adresse','rudy@ravinala.com', 1, 4, 7);

INSERT INTO usagers (matricule, nom, date_naissance, contact,adresse , mail_ravinala, genre_id, poste_id, departement_id)
VALUES ('MAT005', 'Bellock', '2002-05-28', '034 61 123 96', 'adresse','bellock@ravinala.com', 1, 2, 3);


--All insert
--==============================================================================
insert into type_cars (type_cars) values('fret'),('decalee'),('support');

--===============================================================
insert into prestataire(prestataire,debut_contrat,fin_contrat) values('P1','2023-10-02','2024-10-02');

insert into prestataire(prestataire,debut_contrat,fin_contrat) values('P2','2024-10-02','2025-10-02');

--=====================================================================
insert into prestataire_archive(prestataire,debut_contrat,fin_contrat, prestataire_id) values('P1','2023-10-02','2024-10-02',1);

insert into prestataire_archive(prestataire,debut_contrat,fin_contrat, prestataire_id) values('P2','2024-10-02','2025-10-02',2);

--=========================================================
insert into cars(nom_car,immatriculation,nombre_place,prestataire_id,type_cars_id) values('cars 1', '669TBH', 32, 2, 1),
('cars 2', '670TBH', 32, 2, 2),
('cars 3', '690TBH', 24, 2, 3);

--===============================================
insert into conducteurs(nom, date_naissance, adresse, contact, mail)values('chauffeurs 1','1975-06-22','adresse 1', '034 36 524 12 / 033 32 451 42', 'mail'),
('chauffeurs 2','1975-06-23','adresse 2', '034 36 524 12 / 033 32 451 42', 'mail'),
('chauffeurs 3','1975-06-23','adresse 3', '034 36 524 14 / 033 32 451 43', 'mail');

--======================================
insert into axe(axe) values('A1'),('A2'),('A3');

--===================================
insert into axe_conducteurs(axe_id,conducteurs_id,cars_id) values(1,1,1),
(2,2,2),(3,3,3);

--======================================
insert into axe_usagers_ramassage(lieu, heure_ramassage, usagers_id, axe_id)values('lieu 1', '08:30:00',1, 1),
('lieu 2', '06:45:00',2,1),
('lieu 3', '07:32:00',3,2),
('lieu 4', '05:00:00',4,3);

--===================================
insert into axe_usagers_depot(lieu, heure_depot, usagers_id, axe_id)values('lieu 1', '18:30:00',1, 1),
('lieu 2', '16:45:00',2, 1),
('lieu 3', '17:32:00',3, 2),
('lieu 4', '15:45:00',4, 3);

--===================================
insert into pointage_usagers_ramassage(date_pointage, heure_pointage, heure_depart, heure_arrivee, axe_usagers_ramassage_id) values('2024-10-02','08:45:00','04:00:00', '07:45:00', 1),
('2024-10-02','06:45:00','04:00:00','07:45:00', 2),
('2024-10-02','07:25:00','05:00:00','07:30:00', 3),
('2024-10-02','05:20:00','05:00:00', '07:00:00', 4);

--===================================
insert into pointage_usagers_depot(date_pointage, heure_pointage, heure_depart, heure_arrivee, axe_usagers_depot_id) values('2024-10-02','18:30:00','15:30:00', '19:45:00', 1),
('2024-10-02','17:00:00','15:30:00','19:45:00', 2),
('2024-10-02','17:45:00','15:30:00','20:12:00', 3),
('2024-10-02','15:20:00','15:30:00', '18:00:00', 4);

--=======================================
insert into push_week(date_push, heure_push, pointage_usagers_ramassage_id, pointage_usagers_depot_id) values('2024-10-04','08:00:00', 1,1);

--======================================
insert into save_push(date_save_push, heure_save_push, push_week_id) values('2024-10-04','08:00:00',1);