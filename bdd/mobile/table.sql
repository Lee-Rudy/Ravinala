CREATE TABLE pointage_ramassage_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    matricule NVARCHAR(MAX),
    nomUsager NVARCHAR(MAX),
    nomVoiture NVARCHAR(MAX),
    datetime_ramassage NVARCHAR(MAX),  -- DateTime en ISO 8601
    est_present NVARCHAR(MAX),              -- Booléen : 0 = absent, 1 = présent
    recu_le DATETIME DEFAULT GETDATE()  -- Date actuelle par défaut
);

CREATE TABLE pointage_depot_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    matricule NVARCHAR(MAX),
    nomUsager NVARCHAR(MAX),
    nomVoiture NVARCHAR(MAX),
    datetime_depot NVARCHAR(MAX),      -- DateTime en ISO 8601
    est_present NVARCHAR(MAX),              -- Booléen : 0 = absent, 1 = présent
    recu_le DATETIME DEFAULT GETDATE()  -- Date actuelle par défaut
);

CREATE TABLE btn_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    datetime_depart NVARCHAR(MAX),     -- DateTime en ISO 8601
    datetime_arrivee NVARCHAR(MAX),    -- DateTime en ISO 8601
    nomVoiture NVARCHAR(MAX),
    motif NVARCHAR(MAX),
    recu_le DATETIME DEFAULT GETDATE()  -- Date actuelle par défaut
);

-- UPDATE btn_push
-- SET motif = 'rien à signaler'
-- WHERE motif IS NULL;


-- alter table btn_push add motif nvarchar(max);


CREATE TABLE pointage_usagers_imprevu_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    matricule NVARCHAR(MAX),
    nom nvarchar(max), --new
    datetime_imprevu NVARCHAR(MAX),    -- Changer NVARCHAR en DATETIME pour assurer la cohérence
    nomVoiture NVARCHAR(MAX),
    recu_le DATETIME DEFAULT GETDATE()  -- Date actuelle par défaut
);

--new
create table km_matin_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    depart nvarchar(max),
    fin nvarchar(max),
    datetime_matin nvarchar(max),
    nomVoiture NVARCHAR(MAX),
    recu_le datetime default getdate()
);

create table km_soir_push
(
    id INTEGER IDENTITY(1,1) PRIMARY KEY NOT NULL,
    depart nvarchar(max),
    fin nvarchar(max),
    datetime_soir nvarchar(max),
    nomVoiture NVARCHAR(MAX),
    recu_le datetime default getdate()
);