DROP DATABASE IF EXISTS REST;
CREATE DATABASE REST;

USE REST;

DROP TABLE IF EXISTS statut;
DROP TABLE IF EXISTS lien;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS tache;


CREATE TABLE statut (
    label VARCHAR(100) PRIMARY KEY NOT NULL
);
INSERT INTO statut VALUES ('Non precise');
INSERT INTO statut VALUES ('En cours');
INSERT INTO statut VALUES ('Achevée');
INSERT INTO statut VALUES ('Une tache est recquise');
INSERT INTO statut VALUES ('Annulée');



CREATE TABLE tache (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) DEFAULT 'Tâche sans nom',
    dateBegin DATE,
    dateEnd DATE,
    statut VARCHAR(255) DEFAULT 'Non precise',
    FOREIGN KEY (statut) REFERENCES statut(label) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO `tache` (`title`, `dateBegin`, `dateEnd`, `statut`) VALUES ('Tache A', '2020-03-26', '2020-06-29', 'En cours');
INSERT INTO `tache` (`title`, `dateBegin`, `dateEnd`, `statut`) VALUES ('Tache B', '2020-03-26', '2020-06-29', 'Achevée');
INSERT INTO `tache` (`title`, `dateBegin`, `dateEnd`, `statut`) VALUES ('Tache C', '2020-03-26', '2020-06-29', 'Annulée');




CREATE TABLE tag (
    label VARCHAR(100) PRIMARY KEY NOT NULL
);
INSERT INTO tag VALUES ('web');
INSERT INTO tag VALUES ('travail');
INSERT INTO tag VALUES ('autre');




CREATE TABLE tache_tag (
    tache_id INT NOT NULL,
    tag_label VARCHAR(100) NOT NULL,
    FOREIGN KEY (tache_id) REFERENCES tache(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_label) REFERENCES tag(label) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO tache_tag VALUES (1, 'web');
INSERT INTO tache_tag VALUES (2, 'autre');
INSERT INTO tache_tag VALUES (2, 'web');