import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    BarChart3,
    Wrench,
    LogIn
} from "lucide-react";

function Login() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    const [mostrarPassword, setMostrarPassword] =
        useState(false);

    const [recordar, setRecordar] =
        useState(false);

    const [cargando, setCargando] =
        useState(false);

    const [error, setError] =
        useState("");

    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    const iniciarSesion = async (e) => {

        e.preventDefault();

        setError("");

        if (!usuario || !password) {

            setError(
                "Ingresa tu usuario y contraseña."
            );

            return;
        }

        try {

            setCargando(true);

            // ==========================================
            // CONEXIÓN CON BACKEND DE RENDER
            // ==========================================

            const respuesta = await fetch(
                "https://smbiomedic.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );

            const datos = await respuesta.json();

            // ==========================================
            // VALIDAR RESPUESTA
            // ==========================================

            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    "Usuario o contraseña incorrectos."
                );

            }

            // ==========================================
            // GUARDAR TOKEN
            // ==========================================

            if (datos.token) {

                localStorage.setItem(
                    "token",
                    datos.token
                );

            }

            // ==========================================
            // GUARDAR INFORMACIÓN DEL USUARIO
            // ==========================================

            if (datos.usuario) {

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        datos.usuario
                    )
                );

            }

            // ==========================================
            // GUARDAR RECORDAR SESIÓN
            // ==========================================

            localStorage.setItem(
                "recordarSesion",
                recordar ? "true" : "false"
            );

            // ==========================================
            // IR AL DASHBOARD
            // ==========================================

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
                error
            );

            setError(
                error.message ||
                "No se pudo iniciar sesión."
            );

        } finally {

            setCargando(false);

        }

    };

    return (

        <div className="
            min-h-screen
            bg-white
            relative
            overflow-hidden
            flex
            flex-col
        ">

            {/* ==========================================
                FONDO CON SÍMBOLOS MÉDICOS
            ========================================== */}

            <div className="
                absolute
                inset-0
                pointer-events-none
                overflow-hidden
                select-none
            ">

                <div className="
                    absolute
                    inset-0
                    grid
                    grid-cols-7
                    gap-y-16
                    opacity-[0.12]
                    text-orange-400
                    text-5xl
                    font-bold
                ">

                    {Array.from(
                        { length: 70 },
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
                CONTENIDO PRINCIPAL
            ========================================== */}

            <div className="
                relative
                z-10
                flex-1
                flex
                items-center
                justify-center
                px-4
                py-10
            ">

                {/* ======================================
                    TARJETA PRINCIPAL
                ====================================== */}

                <div className="
                    w-full
                    max-w-5xl
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                    border
                    border-gray-100
                    flex
                    flex-col
                    md:flex-row
                ">

                    {/* ==================================
                        PARTE IZQUIERDA
                    ================================== */}

                    <div className="
                        w-full
                        md:w-3/5
                        p-8
                        md:p-12
                    ">

                        {/* LOGO */}

                        <div className="
                            flex
                            justify-center
                            mb-5
                        ">

                            <img
                                src="/logo-biomedic.png"
                                alt="Biomedic Projects"
                                className="
                                    w-64
                                    h-auto
                                    max-h-32
                                    object-contain
                                "
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";
                                }}
                            />

                        </div>

                        {/* TÍTULO */}

                        <div className="
                            text-center
                            mb-8
                        ">

                            <h1 className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-orange-600
                                mb-2
                            ">
                                Iniciar sesión
                            </h1>

                            <p className="
                                text-gray-500
                                text-base
                            ">
                                Sistema de Mantenimiento Hospitalario
                            </p>

                        </div>

                        {/* ERROR */}

                        {error && (

                            <div className="
                                mb-5
                                p-3
                                rounded-lg
                                bg-red-50
                                border
                                border-red-200
                                text-red-600
                                text-sm
                            ">
                                {error}
                            </div>

                        )}

                        {/* ==================================
                            FORMULARIO
                        ================================== */}

                        <form
                            onSubmit={iniciarSesion}
                            className="space-y-6"
                        >

                            {/* USUARIO */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    mb-2
                                ">
                                    Usuario
                                </label>

                                <div className="
                                    relative
                                ">

                                    <User
                                        size={21}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-orange-500
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={usuario}
                                        onChange={(e) =>
                                            setUsuario(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ingresa tu usuario"
                                        autoComplete="username"
                                        className="
                                            w-full
                                            h-14
                                            pl-12
                                            pr-4
                                            border
                                            border-gray-300
                                            rounded-xl
                                            outline-none
                                            text-gray-800
                                            placeholder-gray-400
                                            focus:border-orange-500
                                            focus:ring-2
                                            focus:ring-orange-100
                                            transition
                                        "
                                    />

                                </div>

                            </div>

                            {/* CONTRASEÑA */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    mb-2
                                ">
                                    Contraseña
                                </label>

                                <div className="
                                    relative
                                ">

                                    <Lock
                                        size={21}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-orange-500
                                        "
                                    />

                                    <input
                                        type={
                                            mostrarPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ingresa tu contraseña"
                                        autoComplete="current-password"
                                        className="
                                            w-full
                                            h-14
                                            pl-12
                                            pr-12
                                            border
                                            border-gray-300
                                            rounded-xl
                                            outline-none
                                            text-gray-800
                                            placeholder-gray-400
                                            focus:border-orange-500
                                            focus:ring-2
                                            focus:ring-orange-100
                                            transition
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMostrarPassword(
                                                !mostrarPassword
                                            )
                                        }
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                            hover:text-orange-500
                                            transition
                                        "
                                    >

                                        {mostrarPassword ? (

                                            <EyeOff size={20} />

                                        ) : (

                                            <Eye size={20} />

                                        )}

                                    </button>

                                </div>

                            </div>

                            {/* RECORDAR / OLVIDÓ */}

                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                items-start
                                sm:items-center
                                justify-between
                                gap-3
                            ">

                                <label className="
                                    flex
                                    items-center
                                    gap-2
                                    cursor-pointer
                                    text-sm
                                    text-gray-600
                                ">

                                    <input
                                        type="checkbox"
                                        checked={recordar}
                                        onChange={(e) =>
                                            setRecordar(
                                                e.target.checked
                                            )
                                        }
                                        className="
                                            w-5
                                            h-5
                                            accent-orange-500
                                        "
                                    />

                                    Recordar sesión

                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        alert(
                                            "Comunícate con el administrador para recuperar tu contraseña."
                                        )
                                    }
                                    className="
                                        text-sm
                                        text-orange-600
                                        hover:text-orange-700
                                        font-medium
                                    "
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>

                            </div>

                            {/* BOTÓN */}

                            <button
                                type="submit"
                                disabled={cargando}
                                className="
                                    w-full
                                    h-14
                                    bg-orange-600
                                    hover:bg-orange-700
                                    disabled:bg-orange-300
                                    text-white
                                    rounded-xl
                                    font-semibold
                                    text-lg
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                    shadow-lg
                                    shadow-orange-200
                                    transition
                                "
                            >

                                {cargando ? (

                                    <>

                                        <span className="
                                            w-5
                                            h-5
                                            border-2
                                            border-white
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        " />

                                        Iniciando...

                                    </>

                                ) : (

                                    <>

                                        <LogIn size={21} />

                                        Iniciar sesión

                                    </>

                                )}

                            </button>

                        </form>

                        {/* REGISTRO */}

                        <div className="
                            text-center
                            mt-7
                            text-gray-600
                        ">

                            ¿No tienes una cuenta?

                            <Link
                                to="/registro"
                                className="
                                    ml-1
                                    text-orange-600
                                    font-semibold
                                    hover:text-orange-700
                                "
                            >
                                Regístrate aquí
                            </Link>

                        </div>

                    </div>

                    {/* ==================================
                        PARTE DERECHA
                    ================================== */}

                    <div className="
                        w-full
                        md:w-2/5
                        bg-orange-50
                        p-8
                        md:p-10
                        flex
                        flex-col
                        items-center
                        justify-center
                        border-t
                        md:border-t-0
                        md:border-l
                        border-orange-100
                    ">

                        {/* SÍMBOLO MÉDICO */}

                        <div className="
                            text-orange-600
                            text-8xl
                            mb-4
                            leading-none
                        ">
                            ⚕
                        </div>

                        <h2 className="
                            text-2xl
                            font-bold
                            text-orange-600
                            text-center
                            mb-3
                        ">
                            Gestión eficiente
                        </h2>

                        <p className="
                            text-gray-700
                            text-center
                            leading-relaxed
                            max-w-sm
                            mb-8
                        ">
                            Administra mantenimientos,
                            intervenciones y equipos
                            hospitalarios de forma simple
                            y segura.
                        </p>

                        {/* ==================================
                            CARACTERÍSTICAS
                        ================================== */}

                        <div className="
                            w-full
                            space-y-4
                        ">

                            {/* DATOS SEGUROS */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                bg-white
                                rounded-xl
                                p-3
                                shadow-sm
                                border
                                border-orange-100
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-lg
                                    bg-orange-50
                                    flex
                                    items-center
                                    justify-center
                                    text-orange-600
                                ">

                                    <ShieldCheck size={25} />

                                </div>

                                <span className="
                                    text-gray-700
                                    font-medium
                                ">
                                    Datos seguros
                                </span>

                            </div>

                            {/* REPORTES */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                bg-white
                                rounded-xl
                                p-3
                                shadow-sm
                                border
                                border-orange-100
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-lg
                                    bg-orange-50
                                    flex
                                    items-center
                                    justify-center
                                    text-orange-600
                                ">

                                    <BarChart3 size={25} />

                                </div>

                                <span className="
                                    text-gray-700
                                    font-medium
                                ">
                                    Reportes en tiempo real
                                </span>

                            </div>

                            {/* EQUIPOS */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                bg-white
                                rounded-xl
                                p-3
                                shadow-sm
                                border
                                border-orange-100
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-lg
                                    bg-orange-50
                                    flex
                                    items-center
                                    justify-center
                                    text-orange-600
                                ">

                                    <Wrench size={25} />

                                </div>

                                <span className="
                                    text-gray-700
                                    font-medium
                                ">
                                    Gestión de equipos
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                PIE DE PÁGINA
            ========================================== */}

            <footer className="
                relative
                z-10
                text-center
                pb-6
                text-sm
                text-gray-500
            ">

                © 2026{" "}

                <span className="
                    text-orange-600
                    font-medium
                ">
                    Biomedic Projects
                </span>

                . Todos los derechos reservados.

            </footer>

        </div>

    );

}

export default Login;