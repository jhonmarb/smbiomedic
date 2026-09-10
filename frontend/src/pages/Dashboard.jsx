import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();
    const location = useLocation();

    // ==========================================
    // OBTENER USUARIO
    // ==========================================

    const usuarioGuardado =
        localStorage.getItem("usuario");

    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const cerrarSesion = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/login";

    };


    // ==========================================
    // NAVEGACIÓN
    // ==========================================

    const irA = (ruta) => {

        navigate(ruta);

    };


    // ==========================================
    // VERIFICAR OPCIÓN ACTIVA
    // ==========================================

    const estaActiva = (ruta) => {

        return location.pathname === ruta;

    };


    return (

        <div className="app">

            {/* =====================================================
                FONDO MÉDICO
            ===================================================== */}

            <div className="fondo-medico">

                {Array.from({ length: 35 }).map(
                    (_, indice) => (

                        <span
                            key={indice}
                            className="simbolo-medico"
                        >
                            ⚕
                        </span>

                    )
                )}

            </div>


            {/* =====================================================
                BARRA LATERAL
            ===================================================== */}

            <aside className="barra-lateral">

                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="contenedor-logo">

                    <img
                        src="/logo-biomedic.png"
                        alt="Biomedic Projects"
                        className="logo-biomedic"
                    />

                </div>


                {/* =================================================
                    MENÚ
                ================================================= */}

                <nav className="menu-lateral">

                    {/* DASHBOARD */}

                    <button
                        type="button"
                        className={`opcion-menu ${
                            estaActiva("/dashboard")
                                ? "opcion-activa"
                                : ""
                        }`}
                        onClick={() =>
                            irA("/dashboard")
                        }
                    >

                        <span className="icono-menu">
                            🏠
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* MANTENIMIENTOS */}

                    <button
                        type="button"
                        className={`opcion-menu ${
                            estaActiva("/mantenimientos")
                                ? "opcion-activa"
                                : ""
                        }`}
                        onClick={() =>
                            irA("/mantenimientos")
                        }
                    >

                        <span className="icono-menu">
                            🛠️
                        </span>

                        <span>
                            Mantenimiento
                        </span>

                    </button>


                    {/* INTERVENCIONES */}

                    <button
                        type="button"
                        className={`opcion-menu ${
                            estaActiva("/intervenciones")
                                ? "opcion-activa"
                                : ""
                        }`}
                        onClick={() =>
                            irA("/intervenciones")
                        }
                    >

                        <span className="icono-menu">
                            📋
                        </span>

                        <span>
                            Intervenciones
                        </span>

                    </button>


                    {/* MÁQUINAS */}

                    <button
                        type="button"
                        className={`opcion-menu ${
                            estaActiva("/maquinas")
                                ? "opcion-activa"
                                : ""
                        }`}
                        onClick={() =>
                            irA("/maquinas")
                        }
                    >

                        <span className="icono-menu">
                            🏥
                        </span>

                        <span>
                            Máquinas
                        </span>

                    </button>


                    {/* USUARIOS */}

                    {usuario?.rol === "admin" && (

                        <button
                            type="button"
                            className={`opcion-menu ${
                                estaActiva("/usuarios")
                                    ? "opcion-activa"
                                    : ""
                            }`}
                            onClick={() =>
                                irA("/usuarios")
                            }
                        >

                            <span className="icono-menu">
                                👥
                            </span>

                            <span>
                                Usuarios
                            </span>

                        </button>

                    )}

                </nav>


                {/* =================================================
                    PARTE INFERIOR
                ================================================= */}

                <div className="parte-inferior">

                    <button
                        type="button"
                        className="opcion-menu boton-salir"
                        onClick={cerrarSesion}
                    >

                        <span className="icono-menu">
                            🚪
                        </span>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>

                </div>

            </aside>


            {/* =====================================================
                CONTENIDO PRINCIPAL
            ===================================================== */}

            <main className="contenido-principal">

                {/* =================================================
                    ENCABEZADO
                ================================================= */}

                <header className="encabezado">

                    <div>

                        <h1>
                            Sistema de Mantenimiento
                        </h1>

                        <p>
                            Gestión de equipos hospitalarios
                        </p>

                    </div>


                    {/* INFORMACIÓN DEL USUARIO */}

                    {usuario && (

                        <div className="usuario-header">

                            <div className="usuario-icono">
                                👤
                            </div>

                            <div>

                                <strong>
                                    {usuario.rol === "admin"
                                        ? "Administrador"
                                        : usuario.nombre
                                    }
                                </strong>

                                <span>
                                    {usuario.rol === "admin"
                                        ? "Panel administrativo"
                                        : `Usuario: ${usuario.usuario}`
                                    }
                                </span>

                            </div>

                        </div>

                    )}

                </header>


                {/* =================================================
                    PANEL DEL DASHBOARD
                ================================================= */}

                <section className="contenido">

                    <div className="titulo-seccion">

                        <h2>
                            Panel principal
                        </h2>

                        <p>
                            Bienvenido al sistema de mantenimiento
                            hospitalario.
                        </p>

                    </div>


                    {/* =================================================
                        TARJETA DEL USUARIO
                    ================================================= */}

                    {usuario && (

                        <div className="tarjeta-usuario">

                            <div className="avatar-grande">
                                👤
                            </div>

                            <div>

                                <h3>
                                    Bienvenido, {usuario.nombre}
                                </h3>

                                <p>
                                    <strong>
                                        Usuario:
                                    </strong>{" "}
                                    {usuario.usuario}
                                </p>

                                <p>
                                    <strong>
                                        Rol:
                                    </strong>{" "}
                                    {usuario.rol}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        ACCESOS RÁPIDOS
                    ================================================= */}

                    <div className="titulo-accesos">

                        <h2>
                            Accesos rápidos
                        </h2>

                        <p>
                            Selecciona una opción para continuar.
                        </p>

                    </div>


                    <div className="tarjetas-acceso">

                        {/* MANTENIMIENTOS */}

                        <button
                            type="button"
                            className="tarjeta-acceso"
                            onClick={() =>
                                irA("/mantenimientos")
                            }
                        >

                            <span className="tarjeta-icono">
                                🛠️
                            </span>

                            <span className="tarjeta-titulo">
                                Mantenimientos
                            </span>

                            <span className="tarjeta-descripcion">
                                Registrar y consultar
                                mantenimientos.
                            </span>

                        </button>


                        {/* INTERVENCIONES */}

                        <button
                            type="button"
                            className="tarjeta-acceso"
                            onClick={() =>
                                irA("/intervenciones")
                            }
                        >

                            <span className="tarjeta-icono">
                                📋
                            </span>

                            <span className="tarjeta-titulo">
                                Intervenciones
                            </span>

                            <span className="tarjeta-descripcion">
                                Registrar y consultar
                                intervenciones.
                            </span>

                        </button>


                        {/* MÁQUINAS */}

                        <button
                            type="button"
                            className="tarjeta-acceso"
                            onClick={() =>
                                irA("/maquinas")
                            }
                        >

                            <span className="tarjeta-icono">
                                🏥
                            </span>

                            <span className="tarjeta-titulo">
                                Máquinas
                            </span>

                            <span className="tarjeta-descripcion">
                                Consultar los equipos
                                hospitalarios.
                            </span>

                        </button>


                        {/* USUARIOS */}

                        {usuario?.rol === "admin" && (

                            <button
                                type="button"
                                className="tarjeta-acceso"
                                onClick={() =>
                                    irA("/usuarios")
                                }
                            >

                                <span className="tarjeta-icono">
                                    👥
                                </span>

                                <span className="tarjeta-titulo">
                                    Usuarios
                                </span>

                                <span className="tarjeta-descripcion">
                                    Administrar técnicos,
                                    consultores y usuarios.
                                </span>

                            </button>

                        )}

                    </div>

                </section>


                {/* =================================================
                    PIE DE PÁGINA
                ================================================= */}

                <footer className="pie-pagina">

                    © 2026{" "}

                    <strong>
                        Biomedic Projects
                    </strong>

                    {" "} - Sistema de Mantenimiento
                    Hospitalario

                </footer>

            </main>

        </div>

    );

}

export default Dashboard;