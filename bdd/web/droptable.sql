
--drop table

DROP TABLE IF EXISTS save_push;
DROP TABLE IF EXISTS push_week;
DROP TABLE IF EXISTS pointage_usagers_depot;
DROP TABLE IF EXISTS pointage_usagers_ramassage;
DROP TABLE IF EXISTS axe_usagers_depot;
DROP TABLE IF EXISTS axe_usagers_ramassage;
DROP TABLE IF EXISTS axe_conducteurs;
DROP TABLE IF EXISTS conducteurs;
DROP TABLE IF EXISTS axe;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS prestataire_archive;
DROP TABLE IF EXISTS prestataire;
DROP TABLE IF EXISTS type_cars;
DROP TABLE IF EXISTS usagers;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS poste;
DROP TABLE IF EXISTS departement;
DROP TABLE IF EXISTS login;
DROP TABLE IF EXISTS login_cars;
DROP TABLE IF EXISTS carte_carburants;
DROP TABLE IF EXISTS prestataire_contrat;


--truncate table : utile pour réinitialiser les id de la databasa

truncate table save_push;
truncate table push_week;
truncate table pointage_usagers_depot;
truncate table pointage_usagers_ramassage;
truncate table axe_usagers_depot;
truncate table axe_usagers_ramassage;
truncate table axe_conducteurs;
truncate table conducteurs;
truncate table axe;
truncate table cars;
truncate table prestataire_archive;
truncate table prestataire;
truncate table type_cars;
truncate table usagers;
truncate table genre;
truncate table poste;
truncate table departement;


ALTER DATABASE ravinala SET OFFLINE WITH ROLLBACK IMMEDIATE;
