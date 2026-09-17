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


    // =====================================================
    // ESTADOS
    // =====================================================

    const [usuario, setUsuario] = useState("");

    const [password, setPassword] = useState("");

    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [recordar, setRecordar] = useState(false);

    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // INICIAR SESIÓN
    // =====================================================

    const iniciarSesion = async (e) => {

        e.preventDefault();

        setError("");


        // Validar campos

        if (!usuario || !password) {

            setError(
                "Ingresa tu usuario y contraseña."
            );

            return;
        }


        try {

            setCargando(true);


            // =================================================
            // PETICIÓN AL BACKEND
            // =================================================

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


            // =================================================
            // ERROR DEL SERVIDOR
            // =================================================

            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    "Usuario o contraseña incorrectos."
                );

            }


            // =================================================
            // GUARDAR TOKEN
            // =================================================

            if (datos.token) {

                localStorage.setItem(
                    "token",
                    datos.token
                );

            }


            // =================================================
            // GUARDAR USUARIO
            // =================================================

            if (datos.usuario) {

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(datos.usuario)
                );

            }


            // =================================================
            // RECORDAR SESIÓN
            // =================================================

            localStorage.setItem(
                "recordarSesion",
                recordar ? "true" : "false"
            );


            // =================================================
            // AVISAR A APP.JSX
            // =================================================
            // Esto permite que App.jsx detecte inmediatamente
            // que acabamos de iniciar sesión.

            window.dispatchEvent(
                new Event("authChanged")
            );


            // =================================================
            // IR AL DASHBOARD
            // =================================================

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );


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


    // =====================================================
    // INTERFAZ
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-100 flex">


            {/* =================================================
                PANEL IZQUIERDO
            ================================================= */}

            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">


                {/* Fondo médico */}

                <div className="absolute inset-0 opacity-10">

                    <div className="absolute text-[300px] font-bold text-orange-500 -top-20 -left-20">
                        ⚕
                    </div>

                    <div className="absolute text-[250px] font-bold text-orange-500 bottom-0 right-0">
                        ⚕
                    </div>

                </div>


                <div className="relative z-10 flex flex-col justify-center px-16 text-white">


                    {/* Logo */}

                    <div className="mb-10">

                        <img
                            src="/logo-biomedic.png"
                            alt="Biomedic Projects"
                            className="w-72 h-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                    </div>


                    <h1 className="text-5xl font-bold mb-6">

                        Biomedic
                        <span className="text-orange-500">
                            Projects
                        </span>

                    </h1>


                    <p className="text-xl text-slate-300 max-w-xl leading-relaxed">

                        Sistema de gestión y control para el
                        mantenimiento de equipos biomédicos.

                    </p>


                    {/* Características */}

                    <div className="mt-10 space-y-5">


                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">

                                <Wrench
                                    className="text-orange-500"
                                    size={24}
                                />

                            </div>

                            <div>

                                <h3 className="font-semibold">
                                    Gestión de mantenimientos
                                </h3>

                                <p className="text-sm text-slate-400">
                                    Control organizado de equipos
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">

                                <BarChart3
                                    className="text-orange-500"
                                    size={24}
                                />

                            </div>

                            <div>

                                <h3 className="font-semibold">
                                    Seguimiento
                                </h3>

                                <p className="text-sm text-slate-400">
                                    Información centralizada y organizada
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">

                                <ShieldCheck
                                    className="text-orange-500"
                                    size={24}
                                />

                            </div>

                            <div>

                                <h3 className="font-semibold">
                                    Seguridad
                                </h3>

                                <p className="text-sm text-slate-400">
                                    Acceso según el rol del usuario
                                </p>

                            </div>

                        </div>


                    </div>

                </div>

            </div>


            {/* =================================================
                PANEL DERECHO
            ================================================= */}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">


                <div className="w-full max-w-md">


                    {/* Logo móvil */}

                    <div className="lg:hidden flex justify-center mb-8">

                        <img
                            src="/logo-biomedic.png"
                            alt="Biomedic Projects"
                            className="w-56 h-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                    </div>


                    {/* Encabezado */}

                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-5 shadow-lg">

                            <ShieldCheck
                                size={32}
                                className="text-white"
                            />

                        </div>


                        <h2 className="text-3xl font-bold text-slate-800">

                            Bienvenido

                        </h2>


                        <p className="text-slate-500 mt-2">

                            Ingresa a Biomedic Projects

                        </p>

                    </div>


                    {/* =================================================
                        FORMULARIO
                    ================================================= */}

                    <form
                        onSubmit={iniciarSesion}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
                    >


                        {/* Usuario */}

                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                Usuario

                            </label>


                            <div className="relative">

                                <User
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    type="text"
                                    value={usuario}
                                    onChange={(e) =>
                                        setUsuario(e.target.value)
                                    }
                                    placeholder="Ingresa tu usuario"
                                    autoComplete="username"
                                    className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />

                            </div>

                        </div>


                        {/* Contraseña */}

                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                Contraseña

                            </label>


                            <div className="relative">

                                <Lock
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    type={
                                        mostrarPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setMostrarPassword(
                                            !mostrarPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition"
                                >

                                    {mostrarPassword ? (

                                        <EyeOff size={20} />

                                    ) : (

                                        <Eye size={20} />

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Recordar sesión */}

                        <div className="flex items-center mb-6">

                            <input
                                id="recordar"
                                type="checkbox"
                                checked={recordar}
                                onChange={(e) =>
                                    setRecordar(
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 accent-orange-500"
                            />


                            <label
                                htmlFor="recordar"
                                className="ml-2 text-sm text-slate-600 cursor-pointer"
                            >
                                Recordar sesión
                            </label>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

                                {error}

                            </div>

                        )}


                        {/* =================================================
                            BOTÓN LOGIN
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3.5 rounded-xl transition shadow-md"
                        >

                            {cargando ? (

                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                    Iniciando sesión...
                                </>

                            ) : (

                                <>
                                    <LogIn size={20} />

                                    Iniciar sesión
                                </>

                            )}

                        </button>


                        {/* Registro */}

                        <div className="text-center mt-6">

                            <p className="text-sm text-slate-500">

                                ¿No tienes una cuenta?

                                <Link
                                    to="/registro"
                                    className="ml-1 text-orange-500 font-semibold hover:text-orange-600"
                                >
                                    Crear cuenta
                                </Link>

                            </p>

                        </div>


                    </form>


                    {/* Pie */}

                    <p className="text-center text-xs text-slate-400 mt-6">

                        © 2026 Biomedic Projects

                    </p>


                </div>

            </div>

        </div>

    );

}


export default Login;