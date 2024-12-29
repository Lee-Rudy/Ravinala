INSERT INTO login (nom, mail, mot_de_passe, est_admin)
VALUES ('tanjona', 'tanjona@ravinala.com',  '$2a$06$R7ZwO.ELyR2I2gh6MUBuu.tqwP5w5tdV3lo5Z9Q80dGYgkcYjI44S' ,1);

INSERT INTO login (nom, mail, mot_de_passe,est_admin)
VALUES ('toavina', 'toavina@ravinala.com','$2a$06$fk4mrsWb4RK7H8q8ulNkfOg1N/SuFRLfMI1k89S0XLd38EZBb9RrW',0);

insert into login_cars(nom_car_login, mot_de_passe) values ('car1','car1!'),('car2','car2!'),('car3','car3!');


insert into poste (poste) values 
('Stagiaire'),--1
('RH'),--2
('SI'),--3
('RSE'),--4
('AF'),--5
('JA');--6

--------------------------------------

insert into departement(departement) values 
('DJA'),--1
('DQRSE'),--2
('DOP'),--3
('DGA'),--4
('DRH'),--5
('DSI'),--6
('DAF');--7
------------------------------------------

insert into genre(genre) values('Homme'),('Femme');


----------------------------
insert into usagers (matricule, nom, prenom, contact, adresse, mail_ravinala, genre_id, poste_id, departement_id)
values 
--axe 1 , car 1
('ST-001','Rasolo','Fanomezana','034-12-345-67','Andoharanofotsy','rasolo@gmail.com',1,1,5),
('00001','Rakoto','Andrianina','033-23-456-78','Ambohimangakely','rakoto@gmail.com',1,2,3),
('ST-003','Randria','Fenosoa','032-34-567-89','Ankorondrano','randria@gmail.com',1,3,6),
('ST-004','Ravelo','Tiana','034-45-678-90','Ambanidia','ravelo@gmail.com',1,4,2),
('00005','Razafy','Harinirina','033-56-789-01','Analamahitsy','razafy@gmail.com',1,5,1),
--axe 2 , car2
('ST-006','Rajaona','Fitiavana','032-67-890-12','Ankadifotsy','rajaona@gmail.com',1,6,7),
('ST-007','Rambelo','Andriamatoa','034-78-901-23','Andrainarivo','rambelo@gmail.com',1,1,5),
('00008','Raharimanana','Soanirina','033-89-012-34','Ambohitrimanjaka','raharimanana@gmail.com',1,2,3),
('ST-009','Rasoanaivo','Finaritra','032-90-123-45','Anosizato','rasoanaivo@gmail.com',1,3,6),
('00010','Andriamasinoro','Malala','034-01-234-56','Ivandry','andriamasinoro@gmail.com',1,4,2),
--axe3, car3
('ST-011','Rafanomezantsoa','Toavina','033-12-345-67','Ankadindramamy','rafanomezantsoa@gmail.com',1,5,1),
('00112','Rakotovao','Mampionona','032-23-456-78','Ambohipo','rakotovao@gmail.com',1,6,7),
('ST-012','Randriamanana','Ny Aina','034-34-567-89','Anosy','randriamanana@gmail.com',1,1,5),
('00014','Ratsimbazafy','Zo','033-45-678-90','Ampasapito','ratsimbazafy@gmail.com',1,2,3),
('00015','Rasolofomanana','Tendry','032-56-789-01','Faravohitra','rasolofomanana@gmail.com',1,3,6);

-------------------------------------------------

insert into type_cars (type_cars) values ('fret'),('support'),('decalé');
--------------------------------------------

insert into prestataire(prestataire, debut_contrat, fin_contrat)values('P1','2022-10-14','2024-12-14'),
('P2','2024-12-15','2027-12-15');
--------------------------------------------

insert into prestataire_archive(prestataire, debut_contrat, fin_contrat, prestataire_id)values('Prestataire 1','2022-10-14','2024-12-14', 1),
('Prestataire 2','2024-12-15','2027-12-15', 2);


--------------------------------------------
insert into cars(nom_car, immatriculation, nombre_place, prestataire_id, type_cars_id, est_actif)values('car1','0228TBH',32, 1, 1, 1),
('car2','0230TBA',32, 1, 2, 1),
('car3','0228TBV',36, 1, 3, 1);

---------------------------------------------

insert into conducteurs (nom, date_naissance, adresse, contact, est_actif) values 
('Aina Andrianjaka','1985-10-20','aina@gmail.com','034 01 234 56',1),
('Bema Fidinirina','1990-03-12','','034 02 165 49',1),
('Falihery Gana','1987-06-15','gana@gmail.com','034 03 216 54',1);

---------------------------------------------
insert into axe (axe, duree_trajet, distance_km) values
('axe andoharanofotsy', 120, 5.20),
('axe antanimena', 100, 4),
('axe andranomena', 90, 3.20);

--axe 1 : ivato

--------------------------------
insert into axe_conducteurs(axe_id,conducteurs_id,cars_id) values
(1,1,1),
(2,2,2),
(3,3,3);


--antananarivo antsimondramo andoharanofotsy sampanan'i tongarivo
INSERT INTO axe_usagers_ramassage (lieu, heure_ramassage, est_actif, district, fokontany, usagers_id, axe_id)
VALUES
('malaza clinic', '04:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 1, 1),
('kibo', '04:45:00', 1, 'Antananarivo Antsimondrano', 'Ankadimbahoaka', 2, 1),
('mahamasina', '05:00:00', 1, 'Antananarivo Antsimondrano', 'Anosy', 3, 1),
('blanche neige', '05:10:00', 1, 'Antananarivo Antsimondrano', 'Analakely', 4, 1),
('shalimar', '06:00:00', 1, 'Antananarivo Antsimondrano', 'Tsaralalana', 5, 1),

('pharmacie herizo', '05:30:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 6, 2),
('bigody', '05:35:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 7, 2),
('pharmacie herizo', '06:00:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 8, 2),
('esca antanimena', '06:30:00', 1, 'Antananarivo III', 'antanimena', 9, 2),
('sfx antanimena', '06:45:00', 1, 'Antananarivo III', 'antanimena', 10, 2),

('fiangonana flm', '04:00:00', 1, 'Antananarivo Antsimondrano', '67 ha', 11, 3),
('sapin', '04:45:00', 1, 'Antananarivo Antsimondrano', 'Nanisana', 12, 3),
('pullman', '05:00:00', 1, 'Antananarivo Antsimondrano', 'Ivandry', 13, 3),
('ostie', '06:10:00', 1, 'Antananarivo Antsimondrano', 'Anosivavaka', 14, 3),
('leader price', '07:00:00', 1, 'Antananarivo I', 'Andranomena', 15, 3);


INSERT INTO axe_usagers_depot (lieu, heure_depot, est_actif, district, fokontany, usagers_id, axe_id)
VALUES
('malaza clinic', '15:45:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 1, 1),
('kibo', '16:05:00', 1, 'Antananarivo Antsimondrano', 'Ankadimbahoaka', 2, 1),
('mahamasina', '16:10:00', 1, 'Antananarivo Antsimondrano', 'Anosy', 3, 1),
('blanche neige', '17:08:00', 1, 'Antananarivo Antsimondrano', 'Analakely', 4, 1),
('shalimar', '17:45:00', 1, 'Antananarivo Antsimondrano', 'Tsaralalana', 5, 1),


('henri fraise', '15:45:00', 1, 'Antananarivo III', 'Akorondrano', 6, 2),
('bigody', '16:35:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 7, 2),
('pharmacie herizo', '17:00:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 8, 2),
('esca antanimena', '17:50:00', 1, 'Antananarivo III', 'antanimena', 9, 2),
('sfx antanimena', '18:55:00', 1, 'Antananarivo III', 'antanimena', 10, 2),

('fiangonana flm', '16:00:00', 1, 'Antananarivo Antsimondrano', '67 ha', 11, 3),
('sapin', '17:00:00', 1, 'Antananarivo Antsimondrano', 'Nanisana', 12, 3),
('pullman', '17:30:00', 1, 'Antananarivo Antsimondrano', 'Ivandry', 13, 3),
('ostie', '18:10:00', 1, 'Antananarivo Antsimondrano', 'Anosivavaka', 14, 3),
('leader price', '18:20:00', 1, 'Antananarivo I', 'Andranomena', 15, 3);

------------------------------

insert into pointage_usagers_ramassage(date_pointage, heure_pointage,heure_depart, heure_arrivee, axe_usagers_ramassage_id) VALUES
('2024-10-20', '04:00:00', '03:45:00', '07:40:00', 1),
('2024-10-20', '04:45:00', '03:45:00', '07:40:00', 2),
('2024-10-20', '05:00:00', '03:45:00', '07:40:00', 3),
('2024-10-20', '05:10:00', '03:45:00', '07:40:00', 4),
('2024-10-20', '06:25:00', '03:45:00', '07:40:00', 5),

('2024-10-20', '05:30:00', '05:00:00', '07:30:00', 6),
('2024-10-20', '05:35:00', '05:00:00', '07:30:00', 7),
('2024-10-20', '06:00:00', '05:00:00', '07:30:00', 8),
('2024-10-20', '06:30:00', '05:00:00', '07:30:00', 9),
('2024-10-20', '06:35:00', '05:00:00', '07:30:00', 10),

('2024-10-20', '04:00:00', '03:45:00', '07:10:00', 11),
('2024-10-20', '04:45:00', '03:45:00', '07:10:00', 12),
('2024-10-20', '05:00:00', '03:45:00', '07:10:00', 13),
('2024-10-20', '05:10:00', '03:45:00', '07:10:00', 14),
('2024-10-20', '06:25:00', '03:45:00', '07:10:00', 15);

insert into pointage_usagers_depot(date_pointage, heure_pointage, heure_depart, heure_arrivee, axe_usagers_depot_id) values
('2024-10-20', '15:45:00', '15:30:00', '19:30:00', 1),
('2024-10-20', '16:00:00', '15:30:00', '19:30:00', 2),
('2024-10-20', '17:00:00', '15:30:00', '19:30:00', 3),
('2024-10-20', '17:30:00', '15:30:00', '19:30:00', 4),
('2024-10-20', '17:45:00', '15:35:00', '19:30:00', 5),

('2024-10-20', '15:45:00', '15:35:00', '19:45:00', 6),
('2024-10-20', '16:35:00', '15:35:00', '19:45:00', 7),
('2024-10-20', '17:00:00', '15:35:00', '19:45:00', 8),
('2024-10-20', '17:40:00', '15:35:00', '19:45:00', 9),
('2024-10-20', '18:22:00', '15:35:00', '19:45:00', 10),

('2024-10-20', '16:10:00', '15:30:00', '20:00:00', 11),
('2024-10-20', '17:45:00', '15:30:00', '20:00:00', 12),
('2024-10-20', '18:00:00', '15:30:00', '20:00:00', 13),
('2024-10-20', '18:15:00', '15:30:00', '20:00:00', 14),
('2024-10-20', '18:30:00', '15:30:00', '20:00:00', 15);


---------------------------------------------------

insert into push_week (date_push, heure_push, pointage_usagers_ramassage_id, pointage_usagers_depot_id)VALUES
('2024-10-21', '07:35:00', 1, 1),
('2024-10-21', '07:35:00', 2, 2),
('2024-10-21', '07:35:00', 3, 3),
('2024-10-21', '07:35:00', 4, 4),
('2024-10-21', '07:35:00', 5, 5),

('2024-10-21', '07:45:00', 6, 6),
('2024-10-21', '07:45:00', 7, 7),
('2024-10-21', '07:45:00', 8, 8),
('2024-10-21', '07:45:00', 9, 9),
('2024-10-21', '07:45:00', 10, 10),

('2024-10-21', '07:36:00', 11, 11),
('2024-10-21', '07:36:00', 12, 12),
('2024-10-21', '07:36:00', 13, 13),
('2024-10-21', '07:36:00', 14, 14),
('2024-10-21', '07:36:00', 15, 15);

----------------------------------------------

insert into save_push(date_save_push, heure_save_push, push_week_id)VALUES
('2024-10-21','07:50:00',1),
('2024-10-21','07:50:00',2),
('2024-10-21','07:50:00',3),
('2024-10-21','07:50:00',4),
('2024-10-21','07:50:00',5),

('2024-10-21','07:50:00',6),
('2024-10-21','07:50:00',7),
('2024-10-21','07:50:00',8),
('2024-10-21','07:50:00',9),
('2024-10-21','07:50:00',10),

('2024-10-21','07:50:00',11),
('2024-10-21','07:50:00',12),
('2024-10-21','07:50:00',13),
('2024-10-21','07:50:00',14),
('2024-10-21','07:50:00',15);



--exemple insert :
insert into carte_carburants (nom_prestataire, contrat_type, numero_facture, date_emission, carburants) values ('Prestataire 1','contractuelle', 'N-001','2024-12-03',45000.00);
insert into carte_carburants (nom_prestataire, contrat_type, numero_facture, date_emission, carburants) values ('Prestataire 1','extra', 'N-001','2024-12-03',0);

insert into carte_carburants (nom_prestataire, contrat_type, numero_facture, date_emission, carburants) values ('Prestataire 2','contractuelle', 'N-005','2024-12-07',320000);

insert into prestataire_contrat (nom_prestataire, contrat_type, numero_facture, date_emission, designation, nbr_vehicule, nbr_jour, prix_unitaire) values

('Prestataire 2', 'contractuelle', 'N-005', '2024-12-07','fret', 2, 22, 175000),
('Prestataire 2', 'contractuelle', 'N-005', '2024-12-07','decale', 2, 22, 175000),
('Prestataire 2', 'contractuelle', 'N-005', '2024-12-07','support', 2, 22, 175000),

('Prestataire 1', 'contractuelle', 'N-001', '2024-12-03', 'fret', 2, 22, 175000),
('Prestataire 1', 'contractuelle', 'N-001', '2024-12-03', 'decale', 2, 22, 175000),
('Prestataire 1', 'contractuelle', 'N-001', '2024-12-03', 'support', 2, 22, 175000),

('Prestataire 1', 'extra', 'N-001', '2024-12-03','fête', 2, 1, 175000),
('Prestataire 1', 'extra', 'N-002', '2024-12-04','fête 2', 4, 2, 175000),

('Prestataire 2', 'contractuelle', 'N-002', '2024-02-04','fret', 2, 22, 175000),
('Prestataire 2', 'contractuelle', 'N-002', '2024-02-04','decale', 2, 22, 175000),
('Prestataire 2', 'contractuelle', 'N-002', '2024-02-04','support', 2, 22, 175000);
