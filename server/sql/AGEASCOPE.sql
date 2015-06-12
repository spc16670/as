-- ============================================================================
-- ======== Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 =========
-- ============================================================================

-- This PL/SQL script creates all Ageascope objects including sequences and
-- triggers.  

-- ============================================================================
-- select * from AGEASCOPE_LOG order by LOG_DATE desc
-- select * from ageascope_users;
-- select * from AGEASCOPE_SERVICES;
-- select * from AGEASCOPE_USERS_SERVICES

-- SELECT S.SERVICE, U.HEADSET_ID FROM AGEASCOPE_SERVICES S
-- JOIN AGEASCOPE_USERS_SERVICES US ON US.SERVICE_ID = S.ID
-- JOIN AGEASCOPE_USERS U ON US.USER_ID = U.ID
-- WHERE U.WINDOWS_USERNAME = 'sczaja';

--------------------------------------------------------
-- DROP EXISTING OBJECTS
--------------------------------------------------------
  DECLARE
    TYPE bin_array IS TABLE OF VARCHAR2(30)
    INDEX BY BINARY_INTEGER;
    table_array bin_array; 
  BEGIN
    table_array(1) := 'AGEASCOPE_LOG';
    table_array(2) := 'AGEASCOPE_USERS';
    table_array(3) := 'AGEASCOPE_SERVICES';
    table_array(4) := 'AGEASCOPE_USERS_SERVICES';
    FOR i IN 1 .. table_array.COUNT LOOP
      BEGIN
        dbms_output.put_line('Dropping table: ' || table_array(i));
        EXECUTE IMMEDIATE 'DROP TABLE ' || table_array(i) || ' CASCADE CONSTRAINTS';
      EXCEPTION
        WHEN OTHERS THEN
          IF SQLCODE != -942 THEN
            RAISE;
          ELSE
            dbms_output.put_line('Table does not exist: ' || table_array(i));
          END IF;
        END;
    END LOOP;
 
    -- DROP EXISTING SEQUENCES
    table_array.Delete(); 
    table_array(1) := 'AGEASCOPE_USERS_SEQ';
    table_array(2) := 'AGEASCOPE_SERVICES_SEQ';

    FOR i IN 1 .. table_array.COUNT LOOP
      BEGIN
        dbms_output.put_line('Dropping sequence: ' || table_array(i));
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || table_array(i);
      EXCEPTION
        WHEN OTHERS THEN
          IF SQLCODE != -2289 THEN
            RAISE;
          ELSE
            dbms_output.put_line('Sequence does not exist: ' || table_array(i));
          END IF;
        END;
    END LOOP;
    
    -- DROP EXISTING TRIGGERS IF ANY
    table_array.Delete();
    table_array(1) := 'AGEASCOPE_USERS_TR';
    table_array(2) := 'AGEASCOPE_SERVICES_TR';

    FOR i IN 1 .. table_array.COUNT LOOP
      BEGIN
        dbms_output.put_line('Dropping trigger: ' || table_array(i));
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || table_array(i);
      EXCEPTION
        WHEN OTHERS THEN
          IF SQLCODE != -4080 THEN
            RAISE;
          ELSE
            dbms_output.put_line('Trigger does not exist: ' || table_array(i));
          END IF;
        END;
    END LOOP;

  END;
/
--------------------------------------------------------
--  DDL for Table AGEASCOPE_LOG
--------------------------------------------------------
  CREATE TABLE AGEASCOPE_LOG (
    "USERNAME" VARCHAR2(128)
    ,"HOSTNAME" VARCHAR2(128)
    ,"IP" VARCHAR2(128)
    ,"PORT" INT
    ,"MAC" VARCHAR(24)
    ,"RELEASE" VARCHAR(64)
    ,"TIMESTAMP" LONG
    ,"LOG_DATE" TIMESTAMP
  );
  CREATE OR REPLACE TRIGGER AGEASCOPE_LOG_TR 
    AFTER INSERT ON AGEASCOPE_LOG 
    FOR EACH ROW
  BEGIN  
    INSERT INTO AGEASCOPE_USERS (WINDOWS_USERNAME,DIALLER_USERNAME,HEADSET_ID)
    SELECT :new.USERNAME, NULL, NULL FROM dual
    WHERE NOT EXISTS ( SELECT NULL FROM AGEASCOPE_USERS WHERE WINDOWS_USERNAME LIKE :new.USERNAME );
  END;
  /
--------------------------------------------------------
--  DDL for Table AGEASCOPE_USERS
--------------------------------------------------------
  CREATE TABLE AGEASCOPE_USERS (
    "ID" INT NOT NULL PRIMARY KEY
    ,"WINDOWS_USERNAME" VARCHAR2(128) NOT NULL
    ,"DIALLER_USERNAME" VARCHAR2(128) NULL
    ,"HEADSET_ID" VARCHAR2(4) NULL
  );
  CREATE SEQUENCE AGEASCOPE_USERS_SEQ;
  CREATE OR REPLACE TRIGGER AGEASCOPE_USERS_TR 
    BEFORE INSERT ON AGEASCOPE_USERS 
    FOR EACH ROW
  BEGIN
    SELECT AGEASCOPE_USERS_SEQ.NEXTVAL
    INTO   :new.id
    FROM   dual;
  END;
  /

--------------------------------------------------------
--  DDL for Table AGEASCOPE_SERVICES
--------------------------------------------------------
  CREATE TABLE AGEASCOPE_SERVICES (
    "ID" INT NOT NULL PRIMARY KEY
    ,"SERVICE" VARCHAR2(128) NOT NULL
  );
  CREATE SEQUENCE AGEASCOPE_SERVICES_SEQ;
  CREATE OR REPLACE TRIGGER AGEASCOPE_SERVICES_TR 
    BEFORE INSERT ON AGEASCOPE_SERVICES 
    FOR EACH ROW
  BEGIN
    SELECT AGEASCOPE_SERVICES_SEQ.NEXTVAL
    INTO   :new.id
    FROM   dual;
  END;
  /
--------------------------------------------------------
--  DDL for Table AGEASCOPE_USERS_SERVICES
--------------------------------------------------------
  CREATE TABLE AGEASCOPE_USERS_SERVICES (
    "USER_ID" INT NOT NULL
    ,"SERVICE_ID" INT NOT NULL
    ,CONSTRAINT FK_USER_SERVICES_USERS
      FOREIGN KEY (USER_ID)
      REFERENCES AGEASCOPE_USERS(ID)
    ,CONSTRAINT FK_USER_SERVICES_SERVICES
      FOREIGN KEY (SERVICE_ID)
      REFERENCES AGEASCOPE_SERVICES(ID)
  );

  
    -- SOME TEST DATA

  INSERT INTO AGEASCOPE_USERS (WINDOWS_USERNAME,DIALLER_USERNAME,HEADSET_ID) VALUES ('sczaja',NULL,'4237');
  INSERT INTO AGEASCOPE_USERS (WINDOWS_USERNAME,DIALLER_USERNAME,HEADSET_ID) VALUES ('scowan',NULL,'4246');
  INSERT INTO AGEASCOPE_USERS (WINDOWS_USERNAME,DIALLER_USERNAME,HEADSET_ID) VALUES ('showard',NULL,'4229');
  INSERT INTO AGEASCOPE_USERS (WINDOWS_USERNAME,DIALLER_USERNAME,HEADSET_ID) VALUES ('rjassal',NULL,'4784');
  INSERT INTO AGEASCOPE_SERVICES (SERVICE) VALUES ('viper');
  INSERT INTO AGEASCOPE_SERVICES (SERVICE) VALUES ('dataservices');
  INSERT INTO AGEASCOPE_SERVICES (SERVICE) VALUES ('dialler');
  INSERT INTO AGEASCOPE_SERVICES (SERVICE) VALUES ('admin');
  INSERT INTO AGEASCOPE_SERVICES (SERVICE) VALUES ('strata');
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (1,1);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (1,2);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (1,3);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (1,4);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (1,5);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,1);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,2);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,3);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,4);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,5);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (2,5);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (3,1);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (3,2);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (3,3);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (3,4);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (3,5);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (4,1);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (4,2);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (4,3);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (4,4);
  INSERT INTO AGEASCOPE_USERS_SERVICES VALUES (4,5);

  COMMIT;
  
