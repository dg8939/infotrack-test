/* --------------- Tables ---------------*/
CREATE TABLE Matters (
  id INT PRIMARY KEY,
  reference VARCHAR(15),
  createdAt DATE
);

CREATE TABLE Orders (
  id INT PRIMARY KEY,
  matter_id INT,
  createdAt DATE,
  FOREIGN KEY (matter_id) REFERENCES Matters(id)
);


CREATE TABLE Certificates (
  id INT PRIMARY KEY,
  order_id INT,
  type VARCHAR(15),
  createdAt DATE,
  FOREIGN KEY (order_id) REFERENCES Orders(id)
);

/* --------------- Inserting datas ---------------*/
INSERT INTO Matters (id, reference, createdAt)
VALUES
  (1, 'MAT-001', '2026-02-01'),
  (2, 'MAT-002', '2026-02-02');

INSERT INTO Orders (id, matter_id, createdAt)
VALUES
  (100, 1, '2026-02-01'),
  (101, 1, '2026-02-01'),
  (102, 2, '2026-02-02');

INSERT INTO Certificates (id, order_id, type, createdAt)
VALUES
  (1000, 100, 'Title', '2026-02-01'),
  (1001, 100, 'Plan', '2026-02-01'),
  (1002, 101, 'Section', '2026-02-01'),
  (1003, 102, 'Strata', '2026-02-02'),
  (1004, 102, 'Strata', '2026-01-02');

/* --------------- 1st query --------------- */
Select o.matter_id, COUNT(*) as Certificates_count 
FROM Orders o 
JOIN Certificates c on c.order_id = o.id
WHERE c.createdAt >= date('now', '-30 day')
GROUP BY o.matter_id;

/* --------------- 2nd query --------------- */
SELECT DISTINCT m.id AS matter_id
FROM Matters m
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    JOIN Certificates c ON c.order_id = o.id
    WHERE o.matter_id = m.id
    AND c.type = 'Title'
    AND c.createdAt >= date('now', '-30 day')
);


/* --------------- Explaining the query --------------- */
EXPLAIN QUERY PLAN 
SELECT DISTINCT m.id AS matter_id
FROM Matters m
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    JOIN Certificates c ON c.order_id = o.id
    WHERE o.matter_id = m.id
    AND c.type = 'Title'
    AND c.createdAt >= date('now', '-30 day')
);


/* --------------- Creating index --------------- */
CREATE INDEX idx_certificates
ON Certificates (createdAt, type, order_id);

DROP INDEX idx_certificates;
