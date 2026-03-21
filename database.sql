/*CREATE USER app_user WITH PASSWORD 'password123';*/
DROP DATABASE IF EXISTS app_db_test;

CREATE DATABASE app_db_test
WITH
OWNER = app_user   -- to do: replace with  PostgreSQL user
ENCODING = 'UTF8'
LC_COLLATE = 'ar_SA.UTF-8'  
LC_CTYPE = 'ar_SA.UTF-8'
TEMPLATE = template0;

\c app_db_test;

CREATE TABLE BE_User(
   Id_BE_User SERIAL,
   username VARCHAR(50)  NOT NULL,
   user_email VARCHAR(50) ,
   password_hash TEXT,
   first_name VARCHAR(50) ,
   last_name VARCHAR(50) ,
   user_created_at TIMESTAMPTZ NOT NULL,
   user_created_by INTEGER NULL,
   user_deleted_at TIMESTAMPTZ,
   user_deleted_by INTEGER,
   PRIMARY KEY(Id_BE_User),
   FOREIGN KEY (user_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (user_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Project(
   Id_Project SERIAL,
   project_title_en VARCHAR(50)  NOT NULL,
   project_title_fr VARCHAR(50)  NOT NULL,
   project_title_ar VARCHAR(50)  NOT NULL,
   project_description_en TEXT,
   project_description_fr TEXT,
   project_description_ar TEXT,
   project_start_date TIMESTAMPTZ,
   project_estimated_date TIMESTAMPTZ,
   project_end_date TIMESTAMPTZ,
   project_created_at TIMESTAMPTZ NOT NULL,
   project_created_by INTEGER NOT NULL,
   project_deleted_at TIMESTAMPTZ,
   project_deleted_by INTEGER,
   PRIMARY KEY(Id_Project),
   FOREIGN KEY (project_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (project_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Project_Status(
   Id_Project_Status SERIAL,
   status_en VARCHAR(50)  NOT NULL,
   status_fr VARCHAR(50)  NOT NULL,
   status_ar VARCHAR(50)  NOT NULL,
   PRIMARY KEY(Id_Project_Status),
   UNIQUE(status_en),
   UNIQUE(status_fr),
   UNIQUE(status_ar)
);

CREATE TABLE Company(
   Id_Company SERIAL,
   company_name_en TEXT NOT NULL,
   company_name_fr TEXT,
   company_name_ar TEXT,
   description_en TEXT,
   description_fr TEXT,
   description_ar TEXT,
   company_logo_link TEXT,
   company_website TEXT,
   company_created_at TIMESTAMPTZ NOT NULL,
   company_created_by INTEGER NOT NULL,
   company_deleted_at TIMESTAMPTZ,
   company_deleted_by INTEGER,
   PRIMARY KEY(Id_Company),
   FOREIGN KEY (company_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (company_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Domain_Activity(
   Id_Domain SERIAL,
   domain_name VARCHAR(50) NOT NULL,
   domain_icon_link TEXT,
   domain_added_at TIMESTAMPTZ NOT NULL,
   domain_added_by INTEGER NOT NULL,
   PRIMARY KEY(Id_Domain),
   FOREIGN KEY (domain_added_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE app_Role(
   Id_app_Role SERIAL,
   title_app_Role VARCHAR(50) NOT NULL,
   role_description TEXT,
   PRIMARY KEY(Id_app_Role),
   UNIQUE(title_app_Role)
);

CREATE TABLE Permissions(
   permission_action VARCHAR(50) ,
   PRIMARY KEY(permission_action)
);

CREATE TABLE Project_Image(
   Id_Project_Image SERIAL,
   image_link TEXT NOT NULL,
   image_position INTEGER NOT NULL,
   image_created_at TIMESTAMPTZ NOT NULL,
   image_added_by INTEGER NOT NULL,
   image_deleted_at TIMESTAMPTZ,
   image_deleted_by INTEGER,
   Id_Project INTEGER NOT NULL,
   PRIMARY KEY(Id_Project_Image),
   FOREIGN KEY(Id_Project) REFERENCES Project(Id_Project),
   FOREIGN KEY (image_added_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (image_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Ressource(
   ressource_name VARCHAR(50) ,
   PRIMARY KEY(ressource_name)
);

CREATE TABLE Company_quality(
   Id_Quality SERIAL,
   quality_name VARCHAR(50)  NOT NULL,
   quality_icon_link TEXT,
   quality_added_at TIMESTAMPTZ NOT NULL,
   quality_added_by INTEGER NOT NULL,
   PRIMARY KEY(Id_Quality),
   FOREIGN KEY (quality_added_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Company_Phone(
   Id_Company_Phone SERIAL,
   phone_number VARCHAR(50)  NOT NULL,
   phone_type VARCHAR(50) ,
   phone_is_primary BOOLEAN,
   phone_created_at TIMESTAMPTZ NOT NULL,
   phone_created_by INTEGER NOT NULL,
   phone_deleted_at TIMESTAMPTZ,
   phone_deleted_by INTEGER,
   Id_Company INTEGER NOT NULL,
   PRIMARY KEY(Id_Company_Phone),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY (phone_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (phone_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Company_Email(
   Id_Company_Email SERIAL,
   email TEXT NOT NULL,
   email_type VARCHAR(50) ,
   email_is_primary BOOLEAN,
   email_created_at TIMESTAMPTZ NOT NULL,
   email_created_by INTEGER NOT NULL,
   email_deleted_at TIMESTAMPTZ,
   email_deleted_by INTEGER,
   Id_Company INTEGER NOT NULL,
   PRIMARY KEY(Id_Company_Email),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY (email_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (email_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE Company_Address(
   Id_Company_address SERIAL,
   adress_line1 TEXT NOT NULL,
   adress_line2 TEXT,
   city VARCHAR(50) ,
   company_state VARCHAR(50) ,
   country VARCHAR(50) ,
   postcode VARCHAR(20) ,
   adress_type VARCHAR(50) ,
   address_is_primary BOOLEAN,
   address_created_at TIMESTAMPTZ NOT NULL,
   address_created_by INTEGER NOT NULL,
   address_deleted_at TIMESTAMPTZ,
   address_deleted_by INTEGER,
   Id_Company INTEGER NOT NULL,
   PRIMARY KEY(Id_Company_address),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY (address_created_by) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY (address_deleted_by) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE got_app_Role(
   Id_BE_User INTEGER,
   Id_app_Role INTEGER,
   PRIMARY KEY(Id_BE_User, Id_app_Role),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_app_Role) REFERENCES app_Role(Id_app_Role)
);

CREATE TABLE has_permission_on(
   Id_app_Role INTEGER,
   permission_action VARCHAR(50) ,
   ressource_name VARCHAR(50) ,
   PRIMARY KEY(Id_app_Role, permission_action, ressource_name),
   FOREIGN KEY(Id_app_Role) REFERENCES app_Role(Id_app_Role),
   FOREIGN KEY(permission_action) REFERENCES Permissions(permission_action),
   FOREIGN KEY(ressource_name) REFERENCES Ressource(ressource_name)
);

CREATE TABLE update_user(
   Id_BE_User_Updated_user INTEGER,
   Id_BE_User_Updater INTEGER,
   user_updated_at TIMESTAMPTZ,
   old_email VARCHAR(50) ,
   old_password_hash TEXT,
   old_first VARCHAR(50) ,
   old_last VARCHAR(50) ,
   PRIMARY KEY(Id_BE_User_Updated_user, Id_BE_User_Updater),
   FOREIGN KEY(Id_BE_User_Updated_user) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_BE_User_Updater) REFERENCES BE_User(Id_BE_User)
);

CREATE TABLE attributed_status(
   Id_BE_User INTEGER,
   Id_Project INTEGER,
   Id_Project_Status INTEGER,
   status_attribution_date TIMESTAMPTZ NOT NULL,
   PRIMARY KEY(Id_BE_User, Id_Project, Id_Project_Status),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Project) REFERENCES Project(Id_Project),
   FOREIGN KEY(Id_Project_Status) REFERENCES Project_Status(Id_Project_Status)
);

CREATE TABLE update_project(
   Id_BE_User INTEGER,
   Id_Project INTEGER,
   project_updated_at TIMESTAMPTZ NOT NULL,
   old_project_information JSONB,
   PRIMARY KEY(Id_BE_User, Id_Project),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Project) REFERENCES Project(Id_Project)
);

CREATE TABLE update_image(
   Id_BE_User INTEGER,
   Id_Project_Image INTEGER,
   image_updated_at TIMESTAMPTZ NOT NULL,
   image_old_data JSONB,
   PRIMARY KEY(Id_BE_User, Id_Project_Image),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Project_Image) REFERENCES Project_Image(Id_Project_Image)
);

CREATE TABLE update_domain(
   Id_BE_User INTEGER,
   Id_Domain INTEGER,
   domain_updated_at TIMESTAMPTZ NOT NULL,
   domain_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Domain),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Domain) REFERENCES Domain_Activity(Id_Domain)
);

CREATE TABLE update_quality(
   Id_BE_User INTEGER,
   Id_Quality INTEGER,
   quality_updated_at TIMESTAMPTZ NOT NULL,
   quality_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Quality),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Quality) REFERENCES Company_quality(Id_Quality)
);

CREATE TABLE added_domain(
   Id_BE_User INTEGER,
   Id_Company INTEGER,
   Id_Domain INTEGER,
   added_domain_at TIMESTAMPTZ NOT NULL,
   PRIMARY KEY(Id_BE_User, Id_Company, Id_Domain),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Domain) REFERENCES Domain_Activity(Id_Domain)
);

CREATE TABLE added_quality(
   Id_BE_User INTEGER,
   Id_Company INTEGER,
   Id_Quality INTEGER,
   added_quality_at TIMESTAMPTZ,
   PRIMARY KEY(Id_BE_User, Id_Company, Id_Quality),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Quality) REFERENCES Company_quality(Id_Quality)
);

CREATE TABLE update_company(
   Id_BE_User INTEGER,
   Id_Company INTEGER,
   company_updated_at TIMESTAMPTZ NOT NULL,
   company_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Company),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company)
);

CREATE TABLE added_partner(
   Id_BE_User INTEGER,
   Id_Company_company INTEGER,
   Id_Company_partner INTEGER,
   partnership_date TIMESTAMPTZ,
   PRIMARY KEY(Id_BE_User, Id_Company_company, Id_Company_partner),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company_company) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Company_partner) REFERENCES Company(Id_Company)
);

CREATE TABLE removed_partner(
   Id_BE_User INTEGER,
   Id_Company_partner INTEGER,
   Id_Company_company INTEGER,
   revoked_date TIMESTAMPTZ,
   PRIMARY KEY(Id_BE_User, Id_Company_partner, Id_Company_company),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company_partner) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Company_company) REFERENCES Company(Id_Company)
);

CREATE TABLE removed_domain(
   Id_BE_User INTEGER,
   Id_Company INTEGER,
   Id_Domain INTEGER,
   removed_domain_at TIMESTAMPTZ,
   PRIMARY KEY(Id_BE_User, Id_Company, Id_Domain),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Domain) REFERENCES Domain_Activity(Id_Domain)
);

CREATE TABLE removed_quality(
   Id_BE_User INTEGER,
   Id_Company INTEGER,
   Id_Quality INTEGER,
   removed_quality_at TIMESTAMPTZ,
   PRIMARY KEY(Id_BE_User, Id_Company, Id_Quality),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company) REFERENCES Company(Id_Company),
   FOREIGN KEY(Id_Quality) REFERENCES Company_quality(Id_Quality)
);

CREATE TABLE update_phone(
   Id_BE_User INTEGER,
   Id_Company_Phone INTEGER,
   phone_updated_at TIMESTAMPTZ NOT NULL,
   phone_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Company_Phone),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company_Phone) REFERENCES Company_Phone(Id_Company_Phone)
);

CREATE TABLE update_email(
   Id_BE_User INTEGER,
   Id_Company_Email INTEGER,
   email_updated_at TIMESTAMPTZ NOT NULL,
   email_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Company_Email),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company_Email) REFERENCES Company_Email(Id_Company_Email)
);

CREATE TABLE update_adress(
   Id_BE_User INTEGER,
   Id_Company_address INTEGER,
   adress_updated_at TIMESTAMPTZ NOT NULL,
   adress_old_info JSONB,
   PRIMARY KEY(Id_BE_User, Id_Company_address),
   FOREIGN KEY(Id_BE_User) REFERENCES BE_User(Id_BE_User),
   FOREIGN KEY(Id_Company_address) REFERENCES Company_Address(Id_Company_address)
);


INSERT INTO BE_User (
    username,
    user_email,
    password_hash,
    first_name,
    last_name,
    user_created_at,
    user_created_by
)
VALUES (
    'admin',
    'admin@system.com',
    /* todo: replace with actual hashed password */
    'hashed_password_here',
    'System',
    'Admin',
    NOW(),
    NULL
);

INSERT INTO Permissions (permission_action) VALUES
('create'),
('read'),
('update'),
('delete');

INSERT INTO Ressource (ressource_name) VALUES
('project'),
('company'),
('email'),
('address'),
('phone'),
('domain'),
('quality');

INSERT INTO app_Role (title_app_Role, role_description) VALUES
('admin', 'Full access to everything'),
('project_manager', 'Full control over projects'),
('content_editor', 'Can read and update projects only');

INSERT INTO got_app_Role (Id_BE_User, Id_app_Role)
SELECT u.Id_BE_User, r.Id_app_Role
FROM BE_User u
JOIN app_Role r ON r.title_app_Role = 'admin'
WHERE u.username = 'admin';

INSERT INTO has_permission_on (Id_app_Role, permission_action, ressource_name)
SELECT 
    r.Id_app_Role,
    p.permission_action,
    res.ressource_name
FROM app_Role r
CROSS JOIN Permissions p
CROSS JOIN Ressource res
WHERE r.title_app_Role = 'admin';

INSERT INTO has_permission_on (Id_app_Role, permission_action, ressource_name)
SELECT 
    r.Id_app_Role,
    p.permission_action,
    'project'
FROM app_Role r
CROSS JOIN Permissions p
WHERE r.title_app_Role = 'project_manager';

INSERT INTO has_permission_on (Id_app_Role, permission_action, ressource_name)
SELECT 
    r.Id_app_Role,
    p.permission_action,
    'project'
FROM app_Role r
JOIN Permissions p ON p.permission_action IN ('read', 'update')
WHERE r.title_app_Role = 'content_editor';


INSERT INTO app_Role (title_app_Role, role_description)
VALUES ('company_manager', 'Manages company-related resources excluding projects and users');

INSERT INTO has_permission_on (Id_app_Role, permission_action, ressource_name)
SELECT 
    r.Id_app_Role,
    p.permission_action,
    res.ressource_name
FROM app_Role r
CROSS JOIN Permissions p
CROSS JOIN Ressource res
WHERE r.title_app_Role = 'company_manager'
  AND res.ressource_name IN ('company', 'email', 'address', 'phone', 'domain', 'quality');