import {
    useEffect,
    useRef,
    useState
} from "react";

// =====================================================
// URL DEL BACKEND
// =====================================================

const API_URL = "https://smbiomedic.onrender.com";

function Intervenciones() {

    // =====================================================
    // ESTADOS
    // =====================================================

    const [intervenciones, setIntervenciones] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [maquina, setMaquina] = useState("");
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [equiposAgregados, setEquiposAgregados] = useState("");
    const [archivos, setArchivos] = useState([]);

    const [guardando, setGuardando] = useState(false);

    // =====================================================
    // REFERENCIA ARCHIVOS
    // =====================================================

    const inputArchivosRef = useRef(null);

    // =====================================================
    // USUARIO
    // =====================================================

    const usuarioGuardado = localStorage.getItem("usuario");

    let usuario = null;

    try {
        usuario = usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    } catch (error) {
        console.error("Error leyendo usuario:", error);
        usuario = null;
    }

    const token = localStorage.getItem("token");

    // =====================================================
    // NORMALIZAR ROL
    // =====================================================

    const rolUsuario = usuario?.rol
        ? String(usuario.rol)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
        : "";

    const esTecnico = rolUsuario === "tecnico";

    console.log("Usuario:", usuario);
    console.log("Rol detectado:", rolUsuario);
    console.log("¿Es técnico?:", esTecnico);

    // =====================================================
    // CARGAR DATOS
    // =====================================================

    useEffect(() => {

        if (!token) {
            setMensaje("No hay una sesión activa.");
            setCargando(false);
            return;
        }

        cargarIntervenciones();
        cargarMaquinas();

    }, []);

    // =====================================================
    // OBTENER INTERVENCIONES
    // =====================================================

    const cargarIntervenciones = async () => {

        try {

            const respuesta = await fetch(
                `${API_URL}/api/intervenciones`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const texto = await respuesta.text();

            let datos = {};

            try {
                datos = texto ? JSON.parse(texto) : {};
            } catch {
                datos = {};
            }

            if (!respuesta.ok) {

                console.error(
                    "Error backend intervenciones:",
                    respuesta.status,
                    datos
                );

                setMensaje(
                    datos.mensaje ||
                    datos.message ||
                    `Error obteniendo intervenciones (${respuesta.status})`
                );

                return;
            }

            if (Array.isArray(datos)) {

                setIntervenciones(datos);

            } else if (Array.isArray(datos.intervenciones)) {

                setIntervenciones(datos.intervenciones);

            } else {

                setIntervenciones([]);

            }

        } catch (error) {

            console.error(
                "Error cargando intervenciones:",
                error
            );

            setMensaje(
                "No se pudo conectar con el servidor."
            );

        } finally {

            setCargando(false);

        }

    };

    // =====================================================
    // OBTENER MÁQUINAS
    // =====================================================

    const cargarMaquinas = async () => {

        try {

            const respuesta = await fetch(
                `${API_URL}/api/maquinas`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const texto = await respuesta.text();

            let datos = {};

            try {
                datos = texto ? JSON.parse(texto) : {};
            } catch {
                datos = {};
            }

            if (!respuesta.ok) {

                console.error(
                    "Error cargando máquinas:",
                    respuesta.status,
                    datos
                );

                return;
            }

            if (Array.isArray(datos)) {

                setMaquinas(datos);

            } else if (Array.isArray(datos.maquinas)) {

                setMaquinas(datos.maquinas);

            } else {

                setMaquinas([]);

            }

        } catch (error) {

            console.error(
                "Error cargando máquinas:",
                error
            );

        }

    };

    // =====================================================
    // ABRIR FORMULARIO
    // =====================================================

    const abrirFormulario = () => {

        if (!esTecnico) {

            setMensaje(
                "Solo los usuarios con rol técnico pueden crear intervenciones."
            );

            return;
        }

        setMensaje("");
        setMostrarFormulario(true);

    };

    // =====================================================
    // CANCELAR FORMULARIO
    // =====================================================

    const cancelarFormulario = () => {

        setMostrarFormulario(false);
        setMensaje("");

    };

    // =====================================================
    // CREAR INTERVENCIÓN
    // =====================================================

    const crearIntervencion = async (e) => {

        e.preventDefault();

        setMensaje("");

        // =================================================
        // VALIDAR SESIÓN
        // =================================================

        if (!token) {

            setMensaje(
                "Tu sesión ha expirado. Inicia sesión nuevamente."
            );

            return;
        }

        // =================================================
        // VALIDAR ROL
        // =================================================

        if (!esTecnico) {

            setMensaje(
                "No tienes permisos para crear intervenciones."
            );

            return;
        }

        // =================================================
        // VALIDAR MÁQUINA
        // =================================================

        if (!maquina) {

            setMensaje(
                "Selecciona una máquina."
            );

            return;
        }

        // =================================================
        // VALIDAR FECHA
        // =================================================

        if (!fecha) {

            setMensaje(
                "Selecciona una fecha."
            );

            return;
        }

        // =================================================
        // VALIDAR ARCHIVOS
        // =================================================

        if (archivos.length === 0) {

            setMensaje(
                "Agrega al menos un archivo."
            );

            return;
        }

        try {

            setGuardando(true);

            // =================================================
            // FORMDATA
            // =================================================

            const formulario = new FormData();

            formulario.append(
                "maquina",
                maquina
            );

            formulario.append(
                "fecha",
                fecha
            );

            formulario.append(
                "descripcion",
                descripcion
            );

            formulario.append(
                "equiposAgregados",
                equiposAgregados
            );

            // =================================================
            // ARCHIVOS
            // =================================================

            archivos.forEach((archivo) => {

                formulario.append(
                    "archivos",
                    archivo
                );

            });

            console.log(
                "Enviando intervención:",
                {
                    maquina,
                    fecha,
                    descripcion,
                    equiposAgregados,
                    archivos: archivos.length
                }
            );

            // =================================================
            // ENVIAR AL BACKEND
            // =================================================

            const respuesta = await fetch(
                `${API_URL}/api/intervenciones`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formulario
                }
            );

            const texto = await respuesta.text();

            let datos = {};

            try {
                datos = texto ? JSON.parse(texto) : {};
            } catch {
                datos = {};
            }

            console.log(
                "Respuesta crear intervención:",
                respuesta.status,
                datos
            );

            // =================================================
            // ERROR
            // =================================================

            if (!respuesta.ok) {

                setMensaje(
                    datos.mensaje ||
                    datos.message ||
                    `Error creando intervención (${respuesta.status})`
                );

                return;
            }

            // =================================================
            // ÉXITO
            // =================================================

            setMensaje(
                "Intervención creada correctamente."
            );

            // =================================================
            // LIMPIAR FORMULARIO
            // =================================================

            setMaquina("");
            setFecha("");
            setDescripcion("");
            setEquiposAgregados("");
            setArchivos([]);

            if (inputArchivosRef.current) {

                inputArchivosRef.current.value = "";

            }

            // =================================================
            // OCULTAR FORMULARIO
            // =================================================

            setMostrarFormulario(false);

            // =================================================
            // ACTUALIZAR HISTORIAL
            // =================================================

            await cargarIntervenciones();

        } catch (error) {

            console.error(
                "Error creando intervención:",
                error
            );

            setMensaje(
                "Error conectando con el servidor."
            );

        } finally {

            setGuardando(false);

        }

    };

    // =====================================================
    // AGREGAR ARCHIVOS
    // =====================================================

    const seleccionarArchivos = (e) => {

        const nuevosArchivos = Array.from(
            e.target.files || []
        );

        if (nuevosArchivos.length === 0) {
            return;
        }

        setArchivos(
            (archivosActuales) => [
                ...archivosActuales,
                ...nuevosArchivos
            ]
        );

        e.target.value = "";

    };

    // =====================================================
    // ABRIR SELECTOR
    // =====================================================

    const abrirSelectorArchivos = () => {

        if (inputArchivosRef.current) {

            inputArchivosRef.current.click();

        }

    };

    // =====================================================
    // QUITAR ARCHIVO
    // =====================================================

    const quitarArchivo = (indice) => {

        setArchivos(
            (archivosActuales) =>
                archivosActuales.filter(
                    (_, i) => i !== indice
                )
        );

    };

    // =====================================================
    // QUITAR TODOS
    // =====================================================

    const limpiarArchivos = () => {

        setArchivos([]);

        if (inputArchivosRef.current) {

            inputArchivosRef.current.value = "";

        }

    };

    // =====================================================
    // FORMATO FECHA
    // =====================================================

    const mostrarFecha = (fecha) => {

        if (!fecha) {
            return "Sin fecha";
        }

        return new Date(fecha)
            .toLocaleDateString("es-CO");

    };

    // =====================================================
    // NOMBRE DEL MES
    // =====================================================

    const nombreMes = (numero) => {

        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ];

        return meses[numero - 1] || "Sin mes";

    };

    // =====================================================
    // URL ARCHIVO
    // =====================================================

    const obtenerUrlArchivo = (ruta) => {

        if (!ruta) {
            return "";
        }

        if (
            ruta.startsWith("http://") ||
            ruta.startsWith("https://")
        ) {

            return ruta;

        }

        return `${API_URL}${ruta}`;

    };

    // =====================================================
    // INTERFAZ
    // =====================================================

    return (

        <div className="pagina-mantenimientos">

            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="encabezado-pagina">

                <div>

                    <h1>
                        Intervenciones
                    </h1>

                    <p className="subtitulo">
                        Gestión y seguimiento de las intervenciones
                        realizadas en los equipos hospitalarios.
                    </p>

                </div>

            </div>

            {/* =================================================
                INFORMACIÓN USUARIO
            ================================================= */}

            {usuario && (

                <div className="usuario-info">

                    <div className="usuario-icono">
                        👤
                    </div>

                    <div>

                        <strong>
                            {usuario.nombre}
                        </strong>

                        <span>
                            Usuario: {usuario.usuario}
                        </span>

                        <span>
                            Rol: {usuario.rol}
                        </span>

                    </div>

                </div>

            )}

            {/* =================================================
                MENSAJE
            ================================================= */}

            {mensaje && (

                <div
                    className={
                        mensaje.includes("correctamente")
                            ? "mensaje exito"
                            : "mensaje error"
                    }
                >

                    {mensaje}

                </div>

            )}

            {/* =================================================
                FORMULARIO
            ================================================= */}

            {mostrarFormulario && esTecnico ? (

                <div className="formulario-contenedor">

                    <div className="formulario-encabezado">

                        <div>

                            <h2>
                                Nueva intervención
                            </h2>

                            <p>
                                Registra la información de la
                                intervención realizada.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="boton-cancelar"
                            onClick={cancelarFormulario}
                        >
                            Cancelar
                        </button>

                    </div>

                    <form
                        onSubmit={crearIntervencion}
                        className="formulario-mantenimiento"
                    >

                        {/* MÁQUINA */}

                        <div className="campo">

                            <label>
                                Máquina
                            </label>

                            <select
                                value={maquina}
                                onChange={(e) =>
                                    setMaquina(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Seleccione una máquina
                                </option>

                                {maquinas.map(
                                    (maquinaItem) => (

                                        <option
                                            key={maquinaItem._id}
                                            value={maquinaItem._id}
                                        >

                                            {maquinaItem.codigo}
                                            {" - "}
                                            {maquinaItem.nombre}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* FECHA */}

                        <div className="campo">

                            <label>
                                Fecha de la intervención
                            </label>

                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) =>
                                    setFecha(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* DESCRIPCIÓN */}

                        <div className="campo campo-completo">

                            <label>
                                Descripción de la intervención
                            </label>

                            <textarea
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(e.target.value)
                                }
                                placeholder="Describe el trabajo realizado durante la intervención..."
                                rows="5"
                            />

                        </div>

                        {/* EQUIPOS */}

                        <div className="campo campo-completo">

                            <label>
                                Equipos utilizados o agregados
                            </label>

                            <textarea
                                value={equiposAgregados}
                                onChange={(e) =>
                                    setEquiposAgregados(
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: sensor de temperatura, filtro, correa, rodamiento..."
                                rows="4"
                            />

                        </div>

                        {/* ARCHIVOS */}

                        <div className="campo campo-completo">

                            <label>
                                Archivos de la intervención
                            </label>

                            <p className="ayuda">
                                Puedes agregar varias imágenes,
                                PDF o archivos de Excel.
                            </p>

                            <button
                                type="button"
                                className="boton-archivos"
                                onClick={abrirSelectorArchivos}
                            >
                                📎 Agregar archivos
                            </button>

                            <input
                                ref={inputArchivosRef}
                                type="file"
                                multiple
                                accept=".xlsx,.xls,.jpg,.jpeg,.png,.pdf"
                                onChange={seleccionarArchivos}
                                style={{
                                    display: "none"
                                }}
                            />

                            {archivos.length > 0 && (

                                <div className="archivos-seleccionados">

                                    <div className="archivos-titulo">

                                        <strong>
                                            Archivos seleccionados
                                        </strong>

                                        <span>
                                            {archivos.length}
                                        </span>

                                    </div>

                                    {archivos.map(
                                        (archivo, indice) => (

                                            <div
                                                className="archivo-item"
                                                key={`${archivo.name}-${archivo.size}-${archivo.lastModified}-${indice}`}
                                            >

                                                <span>
                                                    📄 {archivo.name}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="boton-quitar"
                                                    onClick={() =>
                                                        quitarArchivo(indice)
                                                    }
                                                >
                                                    Quitar
                                                </button>

                                            </div>

                                        )
                                    )}

                                    <button
                                        type="button"
                                        className="boton-quitar-todos"
                                        onClick={limpiarArchivos}
                                    >
                                        Quitar todos
                                    </button>

                                </div>

                            )}

                        </div>

                        {/* BOTONES */}

                        <div className="acciones-formulario">

                            <button
                                type="button"
                                className="boton-secundario"
                                onClick={cancelarFormulario}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="boton-guardar"
                                disabled={guardando}
                            >

                                {guardando
                                    ? "Guardando..."
                                    : "Guardar intervención"}

                            </button>

                        </div>

                    </form>

                </div>

            ) : (

                /* =================================================
                   HISTORIAL
                ================================================= */

                <div className="historial">

                    <div className="historial-encabezado">

                        <div>

                            <h2>
                                Historial de intervenciones
                            </h2>

                            <p>
                                Consulta las intervenciones
                                registradas en el sistema.
                            </p>

                        </div>

                        {esTecnico && (

                            <button
                                type="button"
                                className="boton-nuevo"
                                onClick={abrirFormulario}
                            >

                                <span>
                                    ＋
                                </span>

                                Nueva intervención

                            </button>

                        )}

                    </div>

                    {cargando ? (

                        <div className="estado">

                            <p>
                                Cargando intervenciones...
                            </p>

                        </div>

                    ) : intervenciones.length === 0 ? (

                        <div className="estado">

                            <div className="estado-icono">
                                🔧
                            </div>

                            <h3>
                                No hay intervenciones
                            </h3>

                            <p>
                                Todavía no se han registrado
                                intervenciones en el sistema.
                            </p>

                            {esTecnico && (

                                <button
                                    type="button"
                                    className="boton-nuevo"
                                    onClick={abrirFormulario}
                                >
                                    ＋ Nueva intervención
                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="lista-mantenimientos">

                            {intervenciones.map(
                                (intervencion) => (

                                    <div
                                        className="tarjeta-mantenimiento"
                                        key={intervencion._id}
                                    >

                                        <div className="tarjeta-cabecera">

                                            <div>

                                                <h3>
                                                    {
                                                        intervencion.maquina?.codigo ||
                                                        "Sin código"
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        intervencion.maquina?.nombre ||
                                                        "Máquina no disponible"
                                                    }
                                                </p>

                                            </div>

                                            <div className="fecha-tarjeta">

                                                📅{" "}

                                                {mostrarFecha(
                                                    intervencion.fecha
                                                )}

                                            </div>

                                        </div>

                                        <div className="informacion-mantenimiento">

                                            <div className="dato">

                                                <strong>
                                                    Año
                                                </strong>

                                                <span>
                                                    {intervencion.anio}
                                                </span>

                                            </div>

                                            <div className="dato">

                                                <strong>
                                                    Mes
                                                </strong>

                                                <span>
                                                    {nombreMes(
                                                        intervencion.mes
                                                    )}
                                                </span>

                                            </div>

                                            <div className="dato">

                                                <strong>
                                                    Técnico
                                                </strong>

                                                <span>
                                                    {
                                                        intervencion.tecnico?.nombre ||
                                                        "No disponible"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        {intervencion.descripcion && (

                                            <div className="seccion-dato">

                                                <h4>
                                                    Descripción
                                                </h4>

                                                <p>
                                                    {
                                                        intervencion.descripcion
                                                    }
                                                </p>

                                            </div>

                                        )}

                                        {intervencion.equiposAgregados && (

                                            <div className="seccion-dato">

                                                <h4>
                                                    Equipos agregados o utilizados
                                                </h4>

                                                <p>
                                                    {
                                                        intervencion.equiposAgregados
                                                    }
                                                </p>

                                            </div>

                                        )}

                                        <div className="seccion-archivos">

                                            <h4>

                                                📎 Archivos
                                                {" ("}

                                                {
                                                    intervencion.archivos?.length ||
                                                    0
                                                }

                                                {")"}

                                            </h4>

                                            {intervencion.archivos?.length > 0 ? (

                                                <div className="galeria-archivos">

                                                    {intervencion.archivos.map(
                                                        (
                                                            archivo,
                                                            indice
                                                        ) => {

                                                            const esImagen =
                                                                archivo.tipo?.startsWith(
                                                                    "image/"
                                                                );

                                                            const url =
                                                                obtenerUrlArchivo(
                                                                    archivo.ruta
                                                                );

                                                            return (

                                                                <div
                                                                    className="archivo-historial"
                                                                    key={
                                                                        archivo._id ||
                                                                        `${archivo.nombre}-${indice}`
                                                                    }
                                                                >

                                                                    {esImagen ? (

                                                                        <>

                                                                            <img
                                                                                src={url}
                                                                                alt={
                                                                                    archivo.nombre
                                                                                }
                                                                            />

                                                                            <p className="nombre-archivo">
                                                                                {
                                                                                    archivo.nombre
                                                                                }
                                                                            </p>

                                                                            <a
                                                                                href={url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="enlace-archivo"
                                                                            >
                                                                                Ver imagen
                                                                            </a>

                                                                        </>

                                                                    ) : (

                                                                        <>

                                                                            <div className="icono-archivo">
                                                                                📄
                                                                            </div>

                                                                            <p className="nombre-archivo">
                                                                                {
                                                                                    archivo.nombre
                                                                                }
                                                                            </p>

                                                                            <a
                                                                                href={url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                download
                                                                                className="enlace-archivo"
                                                                            >
                                                                                Descargar
                                                                            </a>

                                                                        </>

                                                                    )}

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            ) : (

                                                <p className="sin-archivos">
                                                    No hay archivos adjuntos.
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

            {/* =================================================
                ESTILOS
            ================================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .pagina-mantenimientos {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 35px 40px 60px;
                    font-family: "Segoe UI", Arial, sans-serif;
                    color: #1f2937;
                }

                .encabezado-pagina {
                    margin-bottom: 25px;
                }

                .encabezado-pagina h1 {
                    margin: 0 0 7px;
                    font-size: 30px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .subtitulo {
                    margin: 0;
                    color: #6b7280;
                    font-size: 15px;
                }

                .usuario-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    margin-bottom: 25px;
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                }

                .usuario-icono {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                }

                .usuario-info div:last-child {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .usuario-info span {
                    color: #6b7280;
                    font-size: 13px;
                }

                .mensaje {
                    padding: 12px 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                }

                .mensaje.exito {
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    color: #047857;
                }

                .mensaje.error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                }

                .historial {
                    width: 100%;
                }

                .historial-encabezado {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .historial-encabezado h2 {
                    margin: 0 0 6px;
                    font-size: 21px;
                    color: #1f2937;
                }

                .historial-encabezado p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .boton-nuevo {
                    border: 2px solid #f97316;
                    background: white;
                    color: #ea580c;
                    padding: 11px 18px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition:
                        background-color 0.2s ease,
                        color 0.2s ease,
                        box-shadow 0.2s ease,
                        transform 0.2s ease;
                    white-space: nowrap;
                }

                .boton-nuevo:hover {
                    background: #f97316;
                    color: white;
                    box-shadow:
                        0 5px 14px
                        rgba(249, 115, 22, 0.25);
                    transform: translateY(-1px);
                }

                .boton-nuevo span {
                    font-size: 18px;
                    margin-right: 5px;
                }

                .lista-mantenimientos {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .tarjeta-mantenimiento {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 22px;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.06);
                }

                .tarjeta-cabecera {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    padding-bottom: 16px;
                    border-bottom:
                        1px solid #edf0f2;
                }

                .tarjeta-cabecera h3 {
                    margin: 0 0 4px;
                    font-size: 18px;
                    color: #1f2937;
                }

                .tarjeta-cabecera p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .fecha-tarjeta {
                    background: #fff7ed;
                    color: #c2410c;
                    border: 1px solid #fed7aa;
                    padding: 7px 10px;
                    border-radius: 7px;
                    font-size: 13px;
                    white-space: nowrap;
                }

                .informacion-mantenimiento {
                    display: grid;
                    grid-template-columns:
                        repeat(3, 1fr);
                    gap: 15px;
                    margin: 18px 0;
                }

                .dato {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 11px 13px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .dato strong {
                    font-size: 12px;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                .dato span {
                    font-size: 14px;
                    color: #1f2937;
                }

                .seccion-dato {
                    margin-top: 18px;
                    padding-top: 16px;
                    border-top:
                        1px solid #edf0f2;
                }

                .seccion-dato h4 {
                    margin: 0 0 7px;
                    font-size: 14px;
                    color: #374151;
                }

                .seccion-dato p {
                    margin: 0;
                    line-height: 1.6;
                    font-size: 14px;
                    color: #4b5563;
                    white-space: pre-wrap;
                }

                .seccion-archivos {
                    margin-top: 20px;
                    padding-top: 18px;
                    border-top:
                        1px solid #edf0f2;
                }

                .seccion-archivos h4 {
                    margin: 0 0 14px;
                    font-size: 15px;
                    color: #374151;
                }

                .galeria-archivos {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .archivo-historial {
                    width: 190px;
                    min-height: 175px;
                    border: 1px solid #e5e7eb;
                    border-radius: 9px;
                    padding: 10px;
                    background: #fafafa;
                    display: flex;
                    flex-direction: column;
                }

                .archivo-historial img {
                    width: 168px;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                    display: block;
                    margin-bottom: 8px;
                }

                .icono-archivo {
                    width: 168px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f3f4f6;
                    border-radius: 6px;
                    font-size: 40px;
                    margin-bottom: 8px;
                }

                .nombre-archivo {
                    margin: 0 0 8px;
                    font-size: 12px;
                    color: #4b5563;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .enlace-archivo {
                    color: #6b7280;
                    font-size: 13px;
                    text-decoration: none;
                    font-weight: 600;
                    cursor: pointer;
                }

                .enlace-archivo:hover {
                    color: #f97316;
                    text-decoration: underline;
                }

                .sin-archivos {
                    margin: 0;
                    color: #9ca3af;
                    font-size: 13px;
                }

                .estado {
                    text-align: center;
                    padding: 55px 20px;
                    border:
                        1px dashed #d1d5db;
                    border-radius: 10px;
                    background: #fafafa;
                }

                .estado-icono {
                    font-size: 35px;
                    margin-bottom: 10px;
                }

                .estado h3 {
                    margin: 0 0 6px;
                }

                .estado p {
                    color: #6b7280;
                    margin: 0 0 18px;
                }

                .formulario-contenedor {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.06);
                }

                .formulario-encabezado {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    margin-bottom: 25px;
                    padding-bottom: 18px;
                    border-bottom:
                        1px solid #edf0f2;
                }

                .formulario-encabezado h2 {
                    margin: 0 0 5px;
                    font-size: 22px;
                }

                .formulario-encabezado p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .formulario-mantenimiento {
                    display: grid;
                    grid-template-columns:
                        repeat(2, 1fr);
                    gap: 20px;
                }

                .campo {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                .campo-completo {
                    grid-column: 1 / -1;
                }

                .campo label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }

                .campo input,
                .campo select,
                .campo textarea {
                    width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 7px;
                    padding: 11px 12px;
                    font-family:
                        "Segoe UI",
                        Arial,
                        sans-serif;
                    font-size: 14px;
                    color: #1f2937;
                    background: white;
                    outline: none;
                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .campo textarea {
                    resize: vertical;
                }

                .campo input:focus,
                .campo select:focus,
                .campo textarea:focus {
                    border-color: #f97316;
                    box-shadow:
                        0 0 0 3px
                        rgba(249, 115, 22, 0.12);
                }

                .ayuda {
                    margin: -2px 0 2px;
                    font-size: 12px;
                    color: #6b7280;
                }

                .boton-archivos {
                    width: fit-content;
                    border:
                        1px solid #f97316;
                    background: white;
                    color: #ea580c;
                    padding: 9px 14px;
                    border-radius: 7px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .boton-archivos:hover {
                    background: #f97316;
                    color: white;
                }

                .archivos-seleccionados {
                    margin-top: 14px;
                    padding: 14px;
                    border:
                        1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #f9fafb;
                }

                .archivos-titulo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                    font-size: 13px;
                }

                .archivos-titulo span {
                    background: #f97316;
                    color: white;
                    border-radius: 20px;
                    min-width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }

                .archivo-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding: 8px 0;
                    border-bottom:
                        1px solid #e5e7eb;
                    font-size: 13px;
                }

                .boton-quitar {
                    border: none;
                    background: transparent;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 12px;
                }

                .boton-quitar:hover {
                    color: #dc2626;
                }

                .boton-quitar-todos {
                    margin-top: 12px;
                    border:
                        1px solid #d1d5db;
                    background: white;
                    color: #4b5563;
                    padding: 7px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                }

                .acciones-formulario {
                    grid-column: 1 / -1;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 5px;
                }

                .boton-guardar {
                    border:
                        2px solid #f97316;
                    background: #f97316;
                    color: white;
                    padding: 11px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .boton-guardar:hover {
                    background: #ea580c;
                }

                .boton-guardar:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .boton-secundario,
                .boton-cancelar {
                    border:
                        1px solid #d1d5db;
                    background: white;
                    color: #4b5563;
                    padding: 10px 17px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .boton-secundario:hover,
                .boton-cancelar:hover {
                    border-color: #f97316;
                    color: #ea580c;
                }

                @media (max-width: 750px) {

                    .pagina-mantenimientos {
                        padding:
                            25px 20px 50px;
                    }

                    .historial-encabezado {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .boton-nuevo {
                        width: 100%;
                    }

                    .informacion-mantenimiento {
                        grid-template-columns: 1fr;
                    }

                    .formulario-mantenimiento {
                        grid-template-columns: 1fr;
                    }

                    .campo-completo {
                        grid-column: auto;
                    }

                    .acciones-formulario {
                        grid-column: auto;
                        flex-direction: column;
                    }

                    .acciones-formulario button {
                        width: 100%;
                    }

                    .tarjeta-cabecera {
                        flex-direction: column;
                    }

                    .archivo-historial {
                        width: 100%;
                    }

                    .archivo-historial img,
                    .icono-archivo {
                        width: 100%;
                        height: 180px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Intervenciones;
