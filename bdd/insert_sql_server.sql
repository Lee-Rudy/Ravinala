INSERT INTO login (nom, mail, mot_de_passe, est_admin)
VALUES ('tanjona', 'tanjona@ravinala.com',  '$2a$06$R7ZwO.ELyR2I2gh6MUBuu.tqwP5w5tdV3lo5Z9Q80dGYgkcYjI44S' ,1);

INSERT INTO login (nom, mail, mot_de_passe,est_admin)
VALUES ('toavina', 'toavina@ravinala.com','$2a$06$fk4mrsWb4RK7H8q8ulNkfOg1N/SuFRLfMI1k89S0XLd38EZBb9RrW',0);

insert into poste (poste) values 
('stagiaire'),--1
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
('ST-001','nom1','prenom1','contact1','adresse1','mail1@ravinala.com',1,1,5),
('ST-002','nom2','prenom2','contact2','adresse2','mail2@ravinala.com',1,2,3),
('ST-003','nom3','prenom3','contact3','adresse3','mail3@ravinala.com',1,3,6),
('ST-004','nom4','prenom4','contact4','adresse4','mail4@ravinala.com',1,4,2),
('ST-005','nom5','prenom5','contact5','adresse5','mail5@ravinala.com',1,5,1),
--axe 2 , car2
('ST-006','nom6','prenom6','contact6','adresse6','mail6@ravinala.com',1,6,7),
('ST-007','nom7','prenom7','contact7','adresse7','mail7@ravinala.com',1,1,5),
('ST-008','nom8','prenom8','contact8','adresse8','mail8@ravinala.com',1,2,3),
('ST-009','nom9','prenom9','contact9','adresse9','mail9@ravinala.com',1,3,6),
('ST-010','nom10','prenom10','contact10','adresse10','',1,4,2),
--axe3, car3
('ST-011','nom11','prenom11','contact11','adresse11','mail11@ravinala.com',1,5,1),
('ST-012','nom12','prenom12','contact12','adresse12','mail12@ravinala.com',1,6,7),
('ST-013','nom13','prenom13','contact13','adresse13','mail13@ravinala.com',1,1,5),
('ST-014','nom14','prenom14','contact14','adresse14','mail14@ravinala.com',1,2,3),
('ST-015','nom15','prenom15','contact15','adresse15','mail15@ravinala.com',1,3,6);

-- ('ST-016','nom16','prenom16','contact16','adresse16','mail16@ravinala.com',1,4,2),
-- ('ST-017','nom17','prenom17','contact17','adresse17','mail17@ravinala.com',1,5,1),
-- ('ST-018','nom18','prenom18','contact18','adresse18','mail18@ravinala.com',1,6,7),
-- ('ST-019','nom19','prenom19','contact19','adresse19','mail19@ravinala.com',1,1,5),
-- ('ST-020','nom20','prenom20','contact20','adresse20','',1,2,3),
-- ('ST-021','nom21','prenom21','contact21','adresse21','mail21@ravinala.com',1,3,6),
-- ('ST-022','nom22','prenom22','contact22','adresse22','mail22@ravinala.com',1,4,2),
-- ('ST-023','nom23','prenom23','contact23','adresse23','mail23@ravinala.com',1,5,1),
-- ('ST-024','nom24','prenom24','contact24','adresse24','mail24@ravinala.com',1,6,7),
-- ('ST-025','nom25','prenom25','contact25','adresse25','mail25@ravinala.com',1,1,5),
-- ('ST-026','nom26','prenom26','contact26','adresse26','mail26@ravinala.com',1,2,3),
-- ('ST-027','nom27','prenom27','contact27','adresse27','mail27@ravinala.com',1,3,6),
-- ('ST-028','nom28','prenom28','contact28','adresse28','mail28@ravinala.com',1,4,2),
-- ('ST-029','nom29','prenom29','contact29','adresse29','mail29@ravinala.com',1,5,1),
-- ('ST-030','nom30','prenom30','contact30','adresse30','',1,6,7),
-- ('ST-031','nom31','prenom31','contact31','adresse31','mail31@ravinala.com',1,1,5),
-- ('ST-032','nom32','prenom32','contact32','adresse32','mail32@ravinala.com',1,2,3),
-- ('ST-033','nom33','prenom33','contact33','adresse33','mail33@ravinala.com',1,3,6),
-- ('ST-034','nom34','prenom34','contact34','adresse34','mail34@ravinala.com',1,4,2),
-- ('ST-035','nom35','prenom35','contact35','adresse35','mail35@ravinala.com',1,5,1),
-- ('ST-036','nom36','prenom36','contact36','adresse36','mail36@ravinala.com',1,6,7),
-- ('ST-037','nom37','prenom37','contact37','adresse37','mail37@ravinala.com',1,1,5),
-- ('ST-038','nom38','prenom38','contact38','adresse38','mail38@ravinala.com',1,2,3),
-- ('ST-039','nom39','prenom39','contact39','adresse39','mail39@ravinala.com',1,3,6),
-- ('ST-040','nom40','prenom40','contact40','adresse40','',1,4,2),
-- ('ST-041','nom41','prenom41','contact41','adresse41','mail41@ravinala.com',1,5,1),
-- ('ST-042','nom42','prenom42','contact42','adresse42','mail42@ravinala.com',1,6,7),
-- ('ST-043','nom43','prenom43','contact43','adresse43','mail43@ravinala.com',1,1,5),
-- ('ST-044','nom44','prenom44','contact44','adresse44','mail44@ravinala.com',1,2,3),
-- ('ST-045','nom45','prenom45','contact45','adresse45','mail45@ravinala.com',1,3,6),
-- ('ST-046','nom46','prenom46','contact46','adresse46','mail46@ravinala.com',1,4,2),
-- ('ST-047','nom47','prenom47','contact47','adresse47','mail47@ravinala.com',1,5,1),
-- ('ST-048','nom48','prenom48','contact48','adresse48','mail48@ravinala.com',1,6,7),
-- ('ST-049','nom49','prenom49','contact49','adresse49','mail49@ravinala.com',1,1,5),
-- ('ST-050','nom50','prenom50','contact50','adresse50','',1,2,3);

-------------------------------------------------

insert into type_cars (type_cars) values ('fret'),('support'),('decalé');
--------------------------------------------

insert into prestataire(prestataire, debut_contrat, fin_contrat)values('P1','2022-10-14','2024-12-14'),
('P2','2024-12-15','2027-12-15');
--------------------------------------------

insert into prestataire_archive(prestataire, debut_contrat, fin_contrat, prestataire_id)values('P1','2022-10-14','2024-12-14', 1),
('P2','2024-12-15','2027-12-15', 2);


--------------------------------------------
insert into cars(nom_car, immatriculation, nombre_place, prestataire_id, type_cars_id, est_actif)values('car1','0228TBH',32, 1, 1, 1),
('car2','0230TBA',32, 1, 2, 1),
('car3','0228TBV',36, 1, 3, 1);

---------------------------------------------

insert into conducteurs (nom, date_naissance, adresse, contact, est_actif) values 
('conducteur1','1985-10-20','adresse1','contact1',1),
('conducteur2','1990-03-12','adresse2','contact2',1),
('conducteur3','1987-06-15','adresse3','contact3',1);

---------------------------------------------
insert into axe (axe, duree_trajet, distance_km) values
('axe1', 120, 5.20),
('axe2', 100, 4),
('axe3', 90, 3.20);

--axe 1 : ivato

--------------------------------
insert into axe_conducteurs(axe_id,conducteurs_id,cars_id) values
(1,1,1),
(2,2,2),
(3,3,3);


--antananarivo antsimondramo andoharanofotsy sampanan'i tongarivo
INSERT INTO axe_usagers_ramassage (lieu, heure_ramassage, est_actif, district, fokontany, usagers_id, axe_id)
VALUES
('Sampanana Tongarivo', '04:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 1, 1),
('paraky', '04:45:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 2, 1),
('mon goûter', '05:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 3, 1),
('fasika', '05:10:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 4, 1),
('barage', '06:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 5, 1),


('pharmacie herizo', '05:30:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 6, 2),
('bigody', '05:35:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 7, 2),
('pharmacie herizo', '06:00:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 8, 2),
('esca antanimena', '06:30:00', 1, 'Antananarivo III', 'antanimena', 9, 2),
('sfx antanimena', '06:45:00', 1, 'Antananarivo III', 'antanimena', 10, 2),

('boulangerie', '04:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 11, 3),
('malaza', '04:45:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 12, 3),
('magasin m', '05:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 13, 3),
('ankady', '06:10:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 14, 3),
('fiangonana flm', '07:00:00', 1, 'Antananarivo I', '67 ha', 15, 3);


INSERT INTO axe_usagers_depot (lieu, heure_depot, est_actif, district, fokontany, usagers_id, axe_id)
VALUES
('Sampanana Tongarivo', '15:45:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 1, 1),
('paraky', '16:05:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 2, 1),
('mon goûter', '16:10:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 3, 1),
('fasika', '17:08:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 4, 1),
('barage', '17:45:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 5, 1),


('pharmacie herizo', '15:45:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 6, 2),
('bigody', '16:35:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 7, 2),
('pharmacie herizo', '17:00:00', 1, 'Antananarivo III', 'Befelatanana-ankadifotsy', 8, 2),
('esca antanimena', '17:50:00', 1, 'Antananarivo III', 'antanimena', 9, 2),
('sfx antanimena', '18:55:00', 1, 'Antananarivo III', 'antanimena', 10, 2),

('boulangerie', '16:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 11, 3),
('malaza', '17:00:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 12, 3),
('magasin m', '17:30:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 13, 3),
('ankady', '18:10:00', 1, 'Antananarivo Antsimondrano', 'Andoharanofotsy', 14, 3),
('fiangonana flm', '18:20:00', 1, 'Antananarivo I', '67 ha', 15, 3);

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

