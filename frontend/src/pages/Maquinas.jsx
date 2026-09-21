import { useEffect, useState } from "react";

function Maquinas() {

    const [maquinas, setMaquinas] = useState([]);
    const [nombre, setNombre] = useState("");
    const [areaSoporte, setAreaSoporte] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    // ==============================================
    // OBTENER USUARIO
    // ==============================================

    const usuarioGuardado =
        localStorage.getItem("usuario");

    const usuario =
        usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;

    const token =
        localStorage.getItem("token");


    // ==============================================
    // CARGAR MÁQUINAS
    // ==============================================

    const cargarMaquinas = async () => {

        try {

            const respuesta = await fetch(
                "https://smbiomedic.onrender.com/api/maquinas",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const datos = await respuesta.json();

            if (respuesta.ok) {

                setMaquinas(datos);

            } else {

                setMensaje(
                    datos.mensaje ||
                    "No se pudieron cargar las máquinas"
                );

            }

        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudieron cargar las máquinas"
            );

        }

    };


    useEffect(() => {

        cargarMaquinas();

    }, []);


    // ==============================================
    // CREAR MÁQUINA
    // ==============================================

    const crearMaquina = async (e) => {

        e.preventDefault();

        setMensaje("");

        setCargando(true);

        try {

            const formulario = new FormData();

            formulario.append(
                "nombre",
                nombre
            );

            formulario.append(
                "areaSoporte",
                areaSoporte
            );

            if (archivo) {

                formulario.append(
                    "hojaVida",
                    archivo
                );

            }


            const respuesta = await fetch(
                "https://smbiomedic.onrender.com/api/maquinas",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formulario
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(
                    datos.mensaje ||
                    "Error agregando la máquina"
                );

                return;

            }


            setMensaje(
                "Máquina agregada correctamente"
            );


            // =========================================
            // LIMPIAR FORMULARIO
            // =========================================

            setNombre("");

            setAreaSoporte("");

            setArchivo(null);


            // =========================================
            // LIMPIAR INPUT DE ARCHIVO
            // =========================================

            const inputArchivo =
                document.getElementById(
                    "archivoHojaVida"
                );

            if (inputArchivo) {

                inputArchivo.value = "";

            }


            // =========================================
            // ACTUALIZAR LISTA
            // =========================================

            cargarMaquinas();


        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudo conectar con el servidor"
            );

        } finally {

            setCargando(false);

        }

    };


    // ==============================================
    // DESCARGAR ARCHIVO
    // ==============================================

    const descargarArchivo = (ruta) => {

        if (!ruta) {

            setMensaje(
                "No hay archivo disponible"
            );

            return;

        }


        // =========================================
        // SUPABASE ENTREGA LA URL COMPLETA
        // =========================================

        window.open(
            ruta,
            "_blank",
            "noopener,noreferrer"
        );

    };


    // ==============================================
    // INTERFAZ
    // ==============================================

    return (

        <div className="pagina-maquinas">

            <style>{`

                .pagina-maquinas {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 30px 40px 50px 40px;
                    box-sizing: border-box;
                    font-family: Arial, sans-serif;
                }


                .titulo-maquinas {
                    margin: 0 0 8px 0;
                    font-size: 30px;
                    font-weight: 700;
                    color: #1f2937;
                }


                .subtitulo-maquinas {
                    margin: 0 0 30px 0;
                    color: #6b7280;
                    font-size: 15px;
                }


                .seccion-maquinas {
                    margin-bottom: 35px;
                }


                .encabezado-seccion {
                    margin-bottom: 18px;
                }


                .encabezado-seccion h2 {
                    margin: 0 0 6px 0;
                    font-size: 21px;
                    color: #1f2937;
                }


                .encabezado-seccion p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }


                .formulario-maquina {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
                    max-width: 750px;
                }


                .campo-maquina {
                    margin-bottom: 20px;
                }


                .campo-maquina label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }


                .campo-maquina input[type="text"] {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 11px 13px;
                    border: 1px solid #d1d5db;
                    border-radius: 7px;
                    font-size: 14px;
                    outline: none;
                    transition:
                        border-color 0.2s,
                        box-shadow 0.2s;
                }


                .campo-maquina input[type="text"]:focus {
                    border-color: #f59e0b;
                    box-shadow:
                        0 0 0 3px
                        rgba(245, 158, 11, 0.15);
                }


                .campo-maquina input[type="file"] {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 9px;
                    border: 1px solid #d1d5db;
                    border-radius: 7px;
                    background: #f9fafb;
                    cursor: pointer;
                }


                .boton-maquina {
                    border: 1px solid #d1d5db;
                    background: #ffffff;
                    color: #374151;
                    padding: 10px 18px;
                    border-radius: 7px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;

                    transition:
                        background-color 0.2s,
                        color 0.2s,
                        border-color 0.2s,
                        transform 0.15s;
                }


                .boton-maquina:hover {
                    background: #f59e0b;
                    border-color: #f59e0b;
                    color: #ffffff;
                }


                .boton-maquina:active {
                    background: #d97706;
                    border-color: #d97706;
                    color: #ffffff;
                    transform: scale(0.98);
                }


                .boton-maquina:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }


                .boton-principal {
                    background: #f59e0b;
                    border-color: #f59e0b;
                    color: #ffffff;
                    padding: 11px 22px;
                }


                .boton-principal:hover {
                    background: #d97706;
                    border-color: #d97706;
                    color: #ffffff;
                }


                .boton-principal:active {
                    background: #b45309;
                    border-color: #b45309;
                }


                .mensaje-maquina {
                    margin: 18px 0;
                    padding: 12px 15px;
                    border-radius: 7px;
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                    color: #9a3412;
                    font-size: 14px;
                }


                .lista-maquinas {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(280px, 1fr)
                        );
                    gap: 20px;
                }


                .tarjeta-maquina {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 22px;
                    box-sizing: border-box;
                    min-height: 180px;

                    box-shadow:
                        0 3px 10px
                        rgba(0, 0, 0, 0.05);

                    transition:
                        transform 0.2s,
                        box-shadow 0.2s,
                        border-color 0.2s;
                }


                .tarjeta-maquina:hover {
                    transform: translateY(-2px);

                    box-shadow:
                        0 6px 18px
                        rgba(0, 0, 0, 0.08);

                    border-color: #fbbf24;
                }


                .numero-maquina {
                    display: inline-block;
                    margin-bottom: 10px;
                    padding: 4px 9px;
                    border-radius: 20px;
                    background: #fff7ed;
                    color: #c2410c;
                    font-size: 12px;
                    font-weight: 700;
                }


                .tarjeta-maquina h3 {
                    margin: 0 0 16px 0;
                    font-size: 18px;
                    color: #1f2937;
                }


                .dato-maquina {
                    margin: 0 0 10px 0;
                    color: #4b5563;
                    font-size: 14px;
                    line-height: 1.5;
                }


                .dato-maquina strong {
                    color: #1f2937;
                }


                .boton-descargar {
                    margin-top: 10px;
                    width: 100%;
                    text-align: center;
                }


                .sin-maquinas {
                    padding: 30px;
                    text-align: center;
                    background: #f9fafb;
                    border: 1px dashed #d1d5db;
                    border-radius: 10px;
                    color: #6b7280;
                }


                .archivo-seleccionado {
                    margin-top: 8px;
                    font-size: 13px;
                    color: #6b7280;
                }


                @media (max-width: 700px) {

                    .pagina-maquinas {
                        padding: 25px 18px 40px 18px;
                    }


                    .titulo-maquinas {
                        font-size: 25px;
                    }


                    .formulario-maquina {
                        padding: 18px;
                    }


                    .lista-maquinas {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>


            {/* ==========================================
                TÍTULO
            ========================================== */}

            <h1 className="titulo-maquinas">
                Máquinas
            </h1>


            <p className="subtitulo-maquinas">
                Gestión y consulta de los equipos hospitalarios
            </p>


            {/* ==========================================
                FORMULARIO SOLO ADMIN
            ========================================== */}

            {usuario?.rol === "admin" && (

                <section className="seccion-maquinas">

                    <div className="encabezado-seccion">

                        <h2>
                            Agregar máquina
                        </h2>

                        <p>
                            Registra una nueva máquina en el sistema.
                        </p>

                    </div>


                    <form
                        className="formulario-maquina"
                        onSubmit={crearMaquina}
                    >

                        {/* NOMBRE */}

                        <div className="campo-maquina">

                            <label>
                                Nombre de la máquina
                            </label>

                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: Ventilador mecánico"
                                required
                            />

                        </div>


                        {/* ÁREA DE SOPORTE */}

                        <div className="campo-maquina">

                            <label>
                                Área de soporte
                            </label>

                            <input
                                type="text"
                                value={areaSoporte}
                                onChange={(e) =>
                                    setAreaSoporte(
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: Quirófanos"
                                required
                            />

                        </div>


                        {/* ARCHIVO */}

                        <div className="campo-maquina">

                            <label>
                                Subir archivo Excel
                            </label>

                            <input
                                id="archivoHojaVida"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) =>
                                    setArchivo(
                                        e.target.files[0]
                                    )
                                }
                            />


                            {archivo && (

                                <div className="archivo-seleccionado">

                                    Archivo seleccionado:{" "}

                                    <strong>
                                        {archivo.name}
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* BOTÓN */}

                        <button
                            className="boton-maquina boton-principal"
                            type="submit"
                            disabled={cargando}
                        >

                            {cargando
                                ? "Guardando..."
                                : "Agregar máquina"
                            }

                        </button>

                    </form>

                </section>

            )}


            {/* ==========================================
                MENSAJE
            ========================================== */}

            {mensaje && (

                <div className="mensaje-maquina">

                    {mensaje}

                </div>

            )}


            {/* ==========================================
                LISTA DE MÁQUINAS
            ========================================== */}

            <section className="seccion-maquinas">

                <div className="encabezado-seccion">

                    <h2>
                        Máquinas registradas
                    </h2>

                    <p>
                        Consulta las máquinas disponibles en el sistema.
                    </p>

                </div>


                {maquinas.length === 0 ? (

                    <div className="sin-maquinas">

                        No hay máquinas registradas.

                    </div>

                ) : (

                    <div className="lista-maquinas">

                        {maquinas.map((maquina, indice) => (

                            <div
                                className="tarjeta-maquina"
                                key={maquina._id}
                            >

                                <span className="numero-maquina">
                                    Máquina {indice + 1}
                                </span>


                                <h3>
                                    {maquina.nombre}
                                </h3>


                                <p className="dato-maquina">

                                    <strong>
                                        Área de soporte:
                                    </strong>

                                    {" "}

                                    {maquina.areaSoporte}

                                </p>


                                {maquina.hojaVida && (

                                    <button
                                        className="boton-maquina boton-descargar"
                                        type="button"
                                        onClick={() =>
                                            descargarArchivo(
                                                maquina.hojaVida.ruta
                                            )
                                        }
                                    >

                                        Descargar archivo

                                    </button>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>

    );

}

export default Maquinas;
