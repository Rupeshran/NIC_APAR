--
-- PostgreSQL database dump
--

\restrict ohm963YN5Aon243QMpfUhbR7un38WWBCTDdlVxvnCXyhvJHHB99JKHI8jY0TkCD

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tran; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tran;


ALTER SCHEMA tran OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employee_acr_details; Type: TABLE; Schema: tran; Owner: postgres
--

CREATE TABLE tran.employee_acr_details (
    _id bigint NOT NULL,
    employee_id numeric NOT NULL,
    organisation_id numeric,
    office_id numeric,
    department_id numeric,
    target text,
    achievements text
);


ALTER TABLE tran.employee_acr_details OWNER TO postgres;

--
-- Name: employee_acr_details__id_seq; Type: SEQUENCE; Schema: tran; Owner: postgres
--

CREATE SEQUENCE tran.employee_acr_details__id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tran.employee_acr_details__id_seq OWNER TO postgres;

--
-- Name: employee_acr_details__id_seq; Type: SEQUENCE OWNED BY; Schema: tran; Owner: postgres
--

ALTER SEQUENCE tran.employee_acr_details__id_seq OWNED BY tran.employee_acr_details._id;


--
-- Name: employee_acr_status; Type: TABLE; Schema: tran; Owner: postgres
--

CREATE TABLE tran.employee_acr_status (
    employee_id numeric(10,0) NOT NULL,
    organization_id numeric(5,0),
    office_id numeric(5,0),
    department_id numeric(5,0),
    emp_ini_name character varying(30),
    emp_first_name character varying(100),
    emp_mid_name character varying(30),
    emp_last_name character varying(30),
    is_acr_submitted boolean DEFAULT false,
    sent_to_ro boolean DEFAULT false,
    is_reviewed boolean DEFAULT false
);


ALTER TABLE tran.employee_acr_status OWNER TO postgres;

--
-- Name: employee_details; Type: TABLE; Schema: tran; Owner: postgres
--

CREATE TABLE tran.employee_details (
    employee_id numeric(10,0) NOT NULL,
    organization_id numeric(5,0),
    office_id numeric(5,0),
    department_id numeric(5,0),
    emp_ini_name character varying(30),
    emp_first_name character varying(100),
    emp_mid_name character varying(30),
    emp_last_name character varying(30),
    gender character varying(1),
    date_of_birth date,
    mobile_number character varying
);


ALTER TABLE tran.employee_details OWNER TO postgres;

--
-- Name: reminders; Type: TABLE; Schema: tran; Owner: postgres
--

CREATE TABLE tran.reminders (
    id bigint NOT NULL,
    employee_id numeric(10,0) NOT NULL,
    message text,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sent_by character varying(100)
);


ALTER TABLE tran.reminders OWNER TO postgres;

--
-- Name: reminders_id_seq; Type: SEQUENCE; Schema: tran; Owner: postgres
--

CREATE SEQUENCE tran.reminders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tran.reminders_id_seq OWNER TO postgres;

--
-- Name: reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: tran; Owner: postgres
--

ALTER SEQUENCE tran.reminders_id_seq OWNED BY tran.reminders.id;


--
-- Name: user_login; Type: TABLE; Schema: tran; Owner: postgres
--

CREATE TABLE tran.user_login (
    employee_id numeric(10,0) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(50) NOT NULL
);


ALTER TABLE tran.user_login OWNER TO postgres;

--
-- Name: employee_acr_details _id; Type: DEFAULT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.employee_acr_details ALTER COLUMN _id SET DEFAULT nextval('tran.employee_acr_details__id_seq'::regclass);


--
-- Name: reminders id; Type: DEFAULT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.reminders ALTER COLUMN id SET DEFAULT nextval('tran.reminders_id_seq'::regclass);


--
-- Data for Name: employee_acr_details; Type: TABLE DATA; Schema: tran; Owner: postgres
--

COPY tran.employee_acr_details (_id, employee_id, organisation_id, office_id, department_id, target, achievements) FROM stdin;
5	1009	9	202	207		k
\.


--
-- Data for Name: employee_acr_status; Type: TABLE DATA; Schema: tran; Owner: postgres
--

COPY tran.employee_acr_status (employee_id, organization_id, office_id, department_id, emp_ini_name, emp_first_name, emp_mid_name, emp_last_name, is_acr_submitted, sent_to_ro, is_reviewed) FROM stdin;
1001	1	101	10	Mr.	Rahul		Sharma	t	f	f
1002	1	101	10	Mr.	Amit		Kumar	t	f	f
1003	1	102	20	Ms.	Priya		Singh	t	f	f
1004	1	102	20	Ms.	Rupesh		Rana	t	t	f
1005	1	1	1	\N	Neha	\N	Das	t	t	f
1009	9	202	207	Mr.	Ranjish		Singh	t	f	t
\.


--
-- Data for Name: employee_details; Type: TABLE DATA; Schema: tran; Owner: postgres
--

COPY tran.employee_details (employee_id, organization_id, office_id, department_id, emp_ini_name, emp_first_name, emp_mid_name, emp_last_name, gender, date_of_birth, mobile_number) FROM stdin;
1001	1	101	10	Mr.	Rahul		Sharma	M	1995-05-10	9876543210
1002	1	101	10	Mr.	Amit		Kumar	M	1994-08-20	9876543211
1003	1	102	20	Ms.	Priya		Singh	F	1996-02-15	9876543212
1004	1	102	20	Ms.	Rupesh		Rana	F	1997-09-12	9876543213
1005	1	103	30	Mr.	Neha		Das	M	1993-12-18	9876543214
1009	9	202	207	Mr.	Ranjish		Singh	M	2002-11-08	8009876543
\.


--
-- Data for Name: reminders; Type: TABLE DATA; Schema: tran; Owner: postgres
--

COPY tran.reminders (id, employee_id, message, sent_at, sent_by) FROM stdin;
1	1005	fill the acr asap	2026-06-27 16:30:12.837273	Admin
2	1005	Please complete and submit your APAR at the earliest.	2026-06-27 16:41:59.641726	Admin
3	1007	fill asap	2026-06-28 12:37:00.689939	Admin
\.


--
-- Data for Name: user_login; Type: TABLE DATA; Schema: tran; Owner: postgres
--

COPY tran.user_login (employee_id, username, password, role) FROM stdin;
1001	rahul	rahul123	EMPLOYEE
1002	amit	amit123	EMPLOYEE
1003	priya	priya123	EMPLOYEE
1004	rupesh	rupesh123	EMPLOYEE
1005	neha	neha123	EMPLOYEE
9001	admin	admin123	ADMIN
1009	raju	raju@123	ANALYST
\.


--
-- Name: employee_acr_details__id_seq; Type: SEQUENCE SET; Schema: tran; Owner: postgres
--

SELECT pg_catalog.setval('tran.employee_acr_details__id_seq', 5, true);


--
-- Name: reminders_id_seq; Type: SEQUENCE SET; Schema: tran; Owner: postgres
--

SELECT pg_catalog.setval('tran.reminders_id_seq', 3, true);


--
-- Name: employee_acr_details employee_acr_details_pkey; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.employee_acr_details
    ADD CONSTRAINT employee_acr_details_pkey PRIMARY KEY (_id, employee_id);


--
-- Name: employee_acr_status employee_acr_status_pkey; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.employee_acr_status
    ADD CONSTRAINT employee_acr_status_pkey PRIMARY KEY (employee_id);


--
-- Name: employee_details employee_details_pk_2; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.employee_details
    ADD CONSTRAINT employee_details_pk_2 PRIMARY KEY (employee_id);


--
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- Name: user_login user_login_pkey; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.user_login
    ADD CONSTRAINT user_login_pkey PRIMARY KEY (employee_id);


--
-- Name: user_login user_login_username_key; Type: CONSTRAINT; Schema: tran; Owner: postgres
--

ALTER TABLE ONLY tran.user_login
    ADD CONSTRAINT user_login_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

\unrestrict ohm963YN5Aon243QMpfUhbR7un38WWBCTDdlVxvnCXyhvJHHB99JKHI8jY0TkCD

