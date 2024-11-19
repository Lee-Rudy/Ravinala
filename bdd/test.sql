CREATE TABLE axe_usagers_depot
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    lieu NVARCHAR(MAX) NOT NULL,
    heure_depot TIME NOT NULL,
	est_actif bit default 1,
    district NVARCHAR(MAX),
    fokontany NVARCHAR(MAX),
    usagers_id INT FOREIGN KEY REFERENCES usagers(id),
    -- axe_id INT FOREIGN KEY REFERENCES axe(id),
    axe_conducteurs_id(id_cars, id,_cond, id_axe)
);

liste_r

liste_d

poitage_d
(
    id_point
    id_axe_u_d
    heure
    date 
)

p_r

id_point
    id_axe_u_r
    heure
    date 


id
btn départ date , heure (session) -- rehefa btn arrivee update an'ilay table set where date = date androany 
btn arrivee
id_car



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

CREATE TABLE usagers
(
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    matricule NVARCHAR(50) UNIQUE NOT NULL,
    nom NVARCHAR(100) NOT NULL,
    prenom NVARCHAR(100) NOT NULL,
);

view_push_r
view_push_d