--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: ho_khau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ho_khau (
    so_ho_khau integer NOT NULL,
    so_nha character varying(50),
    duong character varying(50),
    phuong character varying(50),
    quan character varying(50),
    ngay_lam_ho_khau date,
    chu_ho_id integer NOT NULL
);


ALTER TABLE public.ho_khau OWNER TO postgres;

--
-- Name: ho_khau_so_ho_khau_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ho_khau_so_ho_khau_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ho_khau_so_ho_khau_seq OWNER TO postgres;

--
-- Name: ho_khau_so_ho_khau_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ho_khau_so_ho_khau_seq OWNED BY public.ho_khau.so_ho_khau;


--
-- Name: khoan_thu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.khoan_thu (
    id integer NOT NULL,
    ngay_tao date NOT NULL,
    thoi_han date,
    ten_khoan_thu character varying(100) NOT NULL,
    ban_buoc boolean NOT NULL,
    ghi_chu text
);


ALTER TABLE public.khoan_thu OWNER TO postgres;

--
-- Name: khoan_thu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.khoan_thu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.khoan_thu_id_seq OWNER TO postgres;

--
-- Name: khoan_thu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.khoan_thu_id_seq OWNED BY public.khoan_thu.id;


--
-- Name: lich_su_ho_khau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lich_su_ho_khau (
    id integer NOT NULL,
    nhan_khau_id integer NOT NULL,
    ho_khau_id integer NOT NULL,
    loai_thay_doi integer NOT NULL,
    thoi_gian date NOT NULL
);


ALTER TABLE public.lich_su_ho_khau OWNER TO postgres;

--
-- Name: lich_su_ho_khau_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lich_su_ho_khau_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lich_su_ho_khau_id_seq OWNER TO postgres;

--
-- Name: lich_su_ho_khau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lich_su_ho_khau_id_seq OWNED BY public.lich_su_ho_khau.id;


--
-- Name: nhan_khau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nhan_khau (
    id integer NOT NULL,
    ho_ten character varying(100) NOT NULL,
    ngay_sinh date,
    gioi_tinh character varying(10),
    dan_toc character varying(30),
    ton_giao character varying(30),
    cccd character varying(20),
    ngay_cap date,
    noi_cap character varying(100),
    nghe_nghiep character varying(100),
    ghi_chu text
);


ALTER TABLE public.nhan_khau OWNER TO postgres;

--
-- Name: nhan_khau_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nhan_khau_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nhan_khau_id_seq OWNER TO postgres;

--
-- Name: nhan_khau_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nhan_khau_id_seq OWNED BY public.nhan_khau.id;


--
-- Name: nop_tien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nop_tien (
    ho_khau_id integer NOT NULL,
    khoan_thu_id integer NOT NULL,
    nguoi_nop character varying(100),
    so_tien numeric(12,2) NOT NULL,
    ngay_nop date NOT NULL
);


ALTER TABLE public.nop_tien OWNER TO postgres;

--
-- Name: tam_tru_tam_vang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tam_tru_tam_vang (
    id integer NOT NULL,
    nhan_khau_id integer NOT NULL,
    trang_thai character varying(20) NOT NULL,
    dia_chi character varying(100),
    thoi_gian date NOT NULL,
    noi_dung_de_nghi text
);


ALTER TABLE public.tam_tru_tam_vang OWNER TO postgres;

--
-- Name: tam_tru_tam_vang_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tam_tru_tam_vang_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tam_tru_tam_vang_id_seq OWNER TO postgres;

--
-- Name: tam_tru_tam_vang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tam_tru_tam_vang_id_seq OWNED BY public.tam_tru_tam_vang.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    vai_tro character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: ho_khau so_ho_khau; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ho_khau ALTER COLUMN so_ho_khau SET DEFAULT nextval('public.ho_khau_so_ho_khau_seq'::regclass);


--
-- Name: khoan_thu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoan_thu ALTER COLUMN id SET DEFAULT nextval('public.khoan_thu_id_seq'::regclass);


--
-- Name: lich_su_ho_khau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lich_su_ho_khau ALTER COLUMN id SET DEFAULT nextval('public.lich_su_ho_khau_id_seq'::regclass);


--
-- Name: nhan_khau id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhan_khau ALTER COLUMN id SET DEFAULT nextval('public.nhan_khau_id_seq'::regclass);


--
-- Name: tam_tru_tam_vang id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tam_tru_tam_vang ALTER COLUMN id SET DEFAULT nextval('public.tam_tru_tam_vang_id_seq'::regclass);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: ho_khau ho_khau_chu_ho_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ho_khau
    ADD CONSTRAINT ho_khau_chu_ho_id_key UNIQUE (chu_ho_id);


--
-- Name: ho_khau ho_khau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ho_khau
    ADD CONSTRAINT ho_khau_pkey PRIMARY KEY (so_ho_khau);


--
-- Name: khoan_thu khoan_thu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoan_thu
    ADD CONSTRAINT khoan_thu_pkey PRIMARY KEY (id);


--
-- Name: lich_su_ho_khau lich_su_ho_khau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lich_su_ho_khau
    ADD CONSTRAINT lich_su_ho_khau_pkey PRIMARY KEY (id);


--
-- Name: nhan_khau nhan_khau_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhan_khau
    ADD CONSTRAINT nhan_khau_cccd_key UNIQUE (cccd);


--
-- Name: nhan_khau nhan_khau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhan_khau
    ADD CONSTRAINT nhan_khau_pkey PRIMARY KEY (id);


--
-- Name: nop_tien nop_tien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nop_tien
    ADD CONSTRAINT nop_tien_pkey PRIMARY KEY (ho_khau_id, khoan_thu_id);


--
-- Name: tam_tru_tam_vang tam_tru_tam_vang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tam_tru_tam_vang
    ADD CONSTRAINT tam_tru_tam_vang_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: ho_khau ho_khau_chu_ho_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ho_khau
    ADD CONSTRAINT ho_khau_chu_ho_id_fkey FOREIGN KEY (chu_ho_id) REFERENCES public.nhan_khau(id);


--
-- Name: lich_su_ho_khau lich_su_ho_khau_ho_khau_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lich_su_ho_khau
    ADD CONSTRAINT lich_su_ho_khau_ho_khau_id_fkey FOREIGN KEY (ho_khau_id) REFERENCES public.ho_khau(so_ho_khau);


--
-- Name: lich_su_ho_khau lich_su_ho_khau_nhan_khau_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lich_su_ho_khau
    ADD CONSTRAINT lich_su_ho_khau_nhan_khau_id_fkey FOREIGN KEY (nhan_khau_id) REFERENCES public.nhan_khau(id);


--
-- Name: nop_tien nop_tien_ho_khau_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nop_tien
    ADD CONSTRAINT nop_tien_ho_khau_id_fkey FOREIGN KEY (ho_khau_id) REFERENCES public.ho_khau(so_ho_khau);


--
-- Name: nop_tien nop_tien_khoan_thu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nop_tien
    ADD CONSTRAINT nop_tien_khoan_thu_id_fkey FOREIGN KEY (khoan_thu_id) REFERENCES public.khoan_thu(id);


--
-- Name: tam_tru_tam_vang tam_tru_tam_vang_nhan_khau_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tam_tru_tam_vang
    ADD CONSTRAINT tam_tru_tam_vang_nhan_khau_id_fkey FOREIGN KEY (nhan_khau_id) REFERENCES public.nhan_khau(id);


--
-- PostgreSQL database dump complete
--

