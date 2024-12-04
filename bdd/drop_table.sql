drop table save_push;
drop table push_week;
drop table pointage_usagers_depot;
drop table pointage_usagers_ramassage;
drop table axe_usagers_depot;
drop table axe_usagers_ramassage;
drop table axe_conducteurs;
drop table conducteurs;
drop table axe;
drop table cars;
drop table prestataire_archive;
drop table prestataire;
drop table type_cars;
drop table usagers;
drop table genre;
drop table poste;
drop table departement;
drop table login;
drop table carte_carburants;
drop table prestataire_contrat;


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
