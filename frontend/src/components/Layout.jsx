import {
    Link,
    Outlet,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Wrench,
    ClipboardList,
    Building2,
    Users,
    LogOut,
    UserCircle
} from "lucide-react";


function Layout() {

    const location = useLocation();
    const navigate = useNavigate();


    // ==========================================
    // OBTENER USUARIO
    // ==========================================

    let usuario = null;

    try {

        const usuarioGuardado =
            localStorage.getItem("usuario");

        if (usuarioGuardado) {

            usuario = JSON.parse(usuarioGuardado);

        }

    } catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

    }


    // ==========================================
    // RUTA ACTIVA
    // ==========================================

    const estaActivo = (ruta) => {

        return location.pathname === ruta;

    };


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const cerrarSesion = () => {

        // Eliminar información de sesión
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("recordarSesion");


        // Avisar a App.jsx inmediatamente
        window.dispatchEvent(
            new Event("authChanged")
        );


        // Regresar al Login
        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    return (

        <div
            className="
                min-h-screen
                bg-gray-50
                relative
                overflow-hidden
            "
        >


            {/* ==========================================
                FONDO MÉDICO
            ========================================== */}

            <div
                className="
                    fixed
                    inset-0
                    pointer-events-none
                    overflow-hidden
                    select-none
                    z-0
                "
            >

                <div
                    className="
                        absolute
                        inset-0
                        grid
                        grid-cols-6
                        md:grid-cols-8
                        lg:grid-cols-10
                        gap-x-10
                        gap-y-14
                        p-6
                        text-orange-300
                        opacity-[0.10]
                        text-5xl
                        font-bold
                    "
                >

                    {Array.from(
                        { length: 100 },
                        (_, indice) => (

                            <div
                                key={indice}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                ⚕
                            </div>

                        )
                    )}

                </div>

            </div>


            {/* ==========================================
                CONTENEDOR PRINCIPAL
            ========================================== */}

            <div
                className="
                    relative
                    z-10
                    min-h-screen
                    flex
                "
            >


                {/* ======================================
                    MENÚ LATERAL
                ====================================== */}

                <aside
                    className="
                        fixed
                        left-0
                        top-0
                        bottom-0
                        z-30
                        w-72
                        bg-white
                        border-r
                        border-gray-200
                        shadow-xl
                        flex
                        flex-col
                    "
                >


                    {/* ==================================
                        LOGO
                    ================================== */}

                    <div
                        className="
                            h-36
                            px-6
                            flex
                            items-center
                            justify-center
                            border-b
                            border-gray-200
                            bg-white
                        "
                    >

                        <img
                            src="/logo-biomedic.png"
                            alt="Biomedic Projects"
                            className="
                                w-56
                                max-h-28
                                object-contain
                            "
                            onError={(e) => {

                                console.error(
                                    "No se encontró el logo en /logo-biomedic.png"
                                );

                            }}
                        />

                    </div>


                    {/* ==================================
                        INFORMACIÓN DEL USUARIO
                    ================================== */}

                    <div
                        className="
                            px-5
                            py-5
                            border-b
                            border-gray-100
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                p-3
                                rounded-xl
                                bg-orange-50
                                border
                                border-orange-100
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-full
                                    bg-orange-500
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    flex-shrink-0
                                "
                            >

                                <UserCircle
                                    size={25}
                                />

                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mb-0.5
                                    "
                                >
                                    Usuario
                                </p>


                                <p
                                    className="
                                        font-semibold
                                        text-gray-800
                                        truncate
                                    "
                                >

                                    {usuario?.nombre ||
                                        usuario?.usuario ||
                                        "Usuario"}

                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-orange-600
                                        capitalize
                                    "
                                >

                                    {usuario?.rol ||
                                        "usuario"}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        MENÚ
                    ================================== */}

                    <nav
                        className="
                            flex-1
                            px-5
                            py-6
                            overflow-y-auto
                        "
                    >

                        <p
                            className="
                                px-2
                                mb-4
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-gray-400
                            "
                        >
                            Menú principal
                        </p>


                        {/* ==================================
                            MANTENIMIENTOS CORRECTIVOS
                        ================================== */}

                        <Link
                            to="/mantenimientos"
                            className={`
                                group
                                flex
                                items-center
                                gap-4
                                w-full
                                px-4
                                py-3.5
                                mb-3
                                rounded-xl
                                border
                                transition-all
                                duration-200

                                ${
                                    estaActivo(
                                        "/mantenimientos"
                                    )
                                        ? `
                                            bg-orange-500
                                            border-orange-500
                                            text-white
                                            shadow-lg
                                            shadow-orange-200
                                        `
                                        : `
                                            bg-white
                                            border-gray-200
                                            text-gray-700
                                            hover:border-orange-400
                                            hover:bg-orange-50
                                            hover:text-orange-600
                                            hover:shadow-sm
                                        `
                                }
                            `}
                        >

                            <Wrench
                                size={21}
                                className="
                                    flex-shrink-0
                                "
                            />


                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-wide
                                "
                            >
                                Mantenimientos Correctivos
                            </span>

                        </Link>


                        {/* ==================================
                            INTERVENCIONES
                        ================================== */}

                        <Link
                            to="/intervenciones"
                            className={`
                                group
                                flex
                                items-center
                                gap-4
                                w-full
                                px-4
                                py-3.5
                                mb-3
                                rounded-xl
                                border
                                transition-all
                                duration-200

                                ${
                                    estaActivo(
                                        "/intervenciones"
                                    )
                                        ? `
                                            bg-orange-500
                                            border-orange-500
                                            text-white
                                            shadow-lg
                                            shadow-orange-200
                                        `
                                        : `
                                            bg-white
                                            border-gray-200
                                            text-gray-700
                                            hover:border-orange-400
                                            hover:bg-orange-50
                                            hover:text-orange-600
                                            hover:shadow-sm
                                        `
                                }
                            `}
                        >

                            <ClipboardList
                                size={21}
                                className="
                                    flex-shrink-0
                                "
                            />


                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-wide
                                "
                            >
                                Mantenimientos Preventivos
                            </span>

                        </Link>


                        {/* ==================================
                            MÁQUINAS
                        ================================== */}

                        <Link
                            to="/maquinas"
                            className={`
                                group
                                flex
                                items-center
                                gap-4
                                w-full
                                px-4
                                py-3.5
                                mb-3
                                rounded-xl
                                border
                                transition-all
                                duration-200

                                ${
                                    estaActivo("/maquinas")
                                        ? `
                                            bg-orange-500
                                            border-orange-500
                                            text-white
                                            shadow-lg
                                            shadow-orange-200
                                        `
                                        : `
                                            bg-white
                                            border-gray-200
                                            text-gray-700
                                            hover:border-orange-400
                                            hover:bg-orange-50
                                            hover:text-orange-600
                                            hover:shadow-sm
                                        `
                                }
                            `}
                        >

                            <Building2
                                size={21}
                                className="
                                    flex-shrink-0
                                "
                            />


                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-wide
                                "
                            >
                                Máquinas
                            </span>

                        </Link>


                        {/* ==================================
                            USUARIOS
                            SOLO ADMINISTRADOR
                        ================================== */}

                        {usuario?.rol === "admin" && (

                            <Link
                                to="/usuarios"
                                className={`
                                    group
                                    flex
                                    items-center
                                    gap-4
                                    w-full
                                    px-4
                                    py-3.5
                                    mb-3
                                    rounded-xl
                                    border
                                    transition-all
                                    duration-200

                                    ${
                                        estaActivo(
                                            "/usuarios"
                                        )
                                            ? `
                                                bg-orange-500
                                                border-orange-500
                                                text-white
                                                shadow-lg
                                                shadow-orange-200
                                            `
                                            : `
                                                bg-white
                                                border-gray-200
                                                text-gray-700
                                                hover:border-orange-400
                                                hover:bg-orange-50
                                                hover:text-orange-600
                                                hover:shadow-sm
                                            `
                                    }
                                `}
                            >

                                <Users
                                    size={21}
                                    className="
                                        flex-shrink-0
                                    "
                                />


                                <span
                                    className="
                                        text-sm
                                        font-semibold
                                        tracking-wide
                                    "
                                >
                                    Usuarios
                                </span>

                            </Link>

                        )}

                    </nav>


                    {/* ==================================
                        CERRAR SESIÓN
                    ================================== */}

                    <div
                        className="
                            p-5
                            border-t
                            border-gray-200
                        "
                    >

                        <button
                            type="button"
                            onClick={cerrarSesion}
                            className="
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-3
                                px-4
                                py-3.5
                                rounded-xl
                                border
                                border-red-200
                                bg-white
                                text-red-600
                                font-semibold
                                text-sm
                                hover:bg-red-50
                                hover:border-red-300
                                transition-all
                                duration-200
                            "
                        >

                            <LogOut
                                size={20}
                            />

                            <span>
                                Cerrar sesión
                            </span>

                        </button>

                    </div>

                </aside>


                {/* ======================================
                    CONTENIDO DERECHO
                ====================================== */}

                <main
                    className="
                        ml-72
                        min-h-screen
                        flex-1
                        w-[calc(100%-18rem)]
                    "
                >


                    {/* ==================================
                        ENCABEZADO
                    ================================== */}

                    <header
                        className="
                            h-24
                            bg-white
                            border-b
                            border-gray-200
                            px-8
                            flex
                            items-center
                            justify-between
                            shadow-sm
                        "
                    >

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-gray-800
                                "
                            >
                                Sistema de Mantenimiento
                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    tracking-wide
                                    text-gray-500
                                "
                            >
                                Gestión de equipos hospitalarios
                            </p>

                        </div>


                        {/* USUARIO DEL ENCABEZADO */}

                        <div
                            className="
                                hidden
                                md:flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    text-right
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    "
                                >

                                    {usuario?.nombre ||
                                        usuario?.usuario ||
                                        "Usuario"}

                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-orange-600
                                        capitalize
                                    "
                                >

                                    {usuario?.rol ||
                                        "usuario"}

                                </p>

                            </div>


                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-full
                                    bg-orange-100
                                    border
                                    border-orange-200
                                    flex
                                    items-center
                                    justify-center
                                    text-orange-600
                                "
                            >

                                <UserCircle
                                    size={24}
                                />

                            </div>

                        </div>

                    </header>


                    {/* ==================================
                        CONTENIDO
                    ================================== */}

                    <section
                        className="
                            p-6
                            md:p-8
                            relative
                            z-10
                        "
                    >

                        <Outlet />

                    </section>


                    {/* ==================================
                        PIE DE PÁGINA
                    ================================== */}

                    <footer
                        className="
                            px-8
                            py-5
                            text-center
                            text-xs
                            text-gray-400
                        "
                    >

                        © 2026{" "}

                        <span
                            className="
                                text-orange-500
                                font-semibold
                            "
                        >
                            Biomedic Projects
                        </span>

                        {" "}· Sistema de Mantenimiento
                        Hospitalario

                    </footer>

                </main>

            </div>

        </div>

    );

}


export default Layout;