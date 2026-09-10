INSERT INTO users (id, username, email, password_hash)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'demo_user', 'demo@example.com', '$2b$12$wqVtS/39VsOSZCl0alhMu.XD1hfrTDF75sn.XrmRWGLW93HNx.t5W');

INSERT INTO boards (id, title, owner_id)
VALUES 
('123e4567-e89b-12d3-a456-426614174001', 'Frontend Tasks', '123e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174002', 'Backend Tasks', '123e4567-e89b-12d3-a456-426614174000');

INSERT INTO columns (id, board_id, title, position)
VALUES 
('123e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174001', 'To Do', 0),
('123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174001', 'In Progress', 1),
('123e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174001', 'Done', 2),
('123e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174002', 'To Do', 0),
('123e4567-e89b-12d3-a456-426614174007', '123e4567-e89b-12d3-a456-426614174002', 'In Progress', 1),
('123e4567-e89b-12d3-a456-426614174008', '123e4567-e89b-12d3-a456-426614174002', 'Done', 2);

INSERT INTO tasks (id, column_id, title, description, position)
VALUES
('123e4567-e89b-12d3-a456-426614174009', '123e4567-e89b-12d3-a456-426614174003', 'Setup React App', 'Initialize with Vite', 0),
('123e4567-e89b-12d3-a456-42661417400a', '123e4567-e89b-12d3-a456-426614174003', 'Add TailwindCSS', 'Configure tailwind.config.js', 1),
('123e4567-e89b-12d3-a456-42661417400b', '123e4567-e89b-12d3-a456-426614174004', 'Create components', 'Board, Column, Task items', 0),
('123e4567-e89b-12d3-a456-42661417400c', '123e4567-e89b-12d3-a456-426614174005', 'Design mockups', 'Figma sketches', 0),

('123e4567-e89b-12d3-a456-42661417400d', '123e4567-e89b-12d3-a456-426614174006', 'Database schema', 'Init script for Postgres', 0),
('123e4567-e89b-12d3-a456-42661417400e', '123e4567-e89b-12d3-a456-426614174006', 'FastAPI setup', 'Base structure', 1),
('123e4567-e89b-12d3-a456-42661417400f', '123e4567-e89b-12d3-a456-426614174007', 'Auth module', 'JWT integration', 0),
('123e4567-e89b-12d3-a456-426614174010', '123e4567-e89b-12d3-a456-426614174008', 'Read requirements', 'Understood the task', 0),
('123e4567-e89b-12d3-a456-426614174011', '123e4567-e89b-12d3-a456-426614174008', 'CI/CD pipeline', 'GitHub actions', 1),
('123e4567-e89b-12d3-a456-426614174012', '123e4567-e89b-12d3-a456-426614174008', 'Containerize', 'Podman support', 2);
