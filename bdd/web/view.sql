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