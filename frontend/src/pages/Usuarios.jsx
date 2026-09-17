import { useEffect, useState } from "react";

function Usuarios() {

    // =====================================================
    // ESTADOS
    // =====================================================

    const [usuarios, setUsuarios] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [editando, setEditando] = useState(null);

    const [mensaje, setMensaje] = useState("");

    const [error, setError] = useState("");

    const [formulario, setFormulario] = useState({
        nombre: "",
        usuario: "",
        password: "",
        rol: "consulta"
    });


    // =====================================================
    // CARGAR USUARIOS
    // =====================================================

    const cargarUsuarios = async () => {

        try {

            setCargando(true);

            const respuesta = await fetch(
                "https://smbiomedic.onrender.com/api/usuarios"
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    "Error al cargar usuarios"
                );

            }

            setUsuarios(datos);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "No se pudieron cargar los usuarios"
            );

        } finally {

            setCargando(false);

        }

    };


    // =====================================================
    // CARGAR AL INICIAR
    // =====================================================

    useEffect(() => {

        cargarUsuarios();

    }, []);


    // =====================================================
    // CAMBIAR INPUT
    // =====================================================

    const cambiarFormulario = (e) => {

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // LIMPIAR FORMULARIO
    // =====================================================

    const limpiarFormulario = () => {

        setFormulario({
            nombre: "",
            usuario: "",
            password: "",
            rol: "consulta"
        });

        setEditando(null);

        setMostrarFormulario(false);

    };


    // =====================================================
    // NUEVO USUARIO
    // =====================================================

    const nuevoUsuario = () => {

        setFormulario({
            nombre: "",
            usuario: "",
            password: "",
            rol: "consulta"
        });

        setEditando(null);

        setMensaje("");

        setError("");

        setMostrarFormulario(true);

    };


    // =====================================================
    // EDITAR USUARIO
    // =====================================================

    const editarUsuario = (usuario) => {

        setFormulario({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            password: "",
            rol: usuario.rol
        });

        setEditando(usuario);

        setMensaje("");

        setError("");

        setMostrarFormulario(true);

    };


    // =====================================================
    // GUARDAR USUARIO
    // =====================================================

    const guardarUsuario = async (e) => {

        e.preventDefault();

        setMensaje("");

        setError("");

        try {

            // ==========================================
            // CREAR
            // ==========================================

            if (!editando) {

                if (
                    !formulario.nombre ||
                    !formulario.usuario ||
                    !formulario.password
                ) {

                    setError(
                        "Completa todos los campos obligatorios"
                    );

                    return;

                }


                const respuesta = await fetch(
                    "https://smbiomedic.onrender.com/api/usuarios",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            formulario
                        )
                    }
                );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.mensaje ||
                        "Error al crear usuario"
                    );

                }


                setMensaje(
                    "Usuario creado correctamente"
                );

            }


            // ==========================================
            // EDITAR
            // ==========================================

            else {

                const respuesta = await fetch(
                    `https://smbiomedic.onrender.com/api/usuarios/${editando._id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            formulario
                        )
                    }
                );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.mensaje ||
                        "Error al actualizar usuario"
                    );

                }


                setMensaje(
                    "Usuario actualizado correctamente"
                );

            }


            limpiarFormulario();

            await cargarUsuarios();


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Ocurrió un error"
            );

        }

    };


    // =====================================================
    // ACTIVAR / DESACTIVAR
    // =====================================================

    const cambiarEstado = async (usuario) => {

        try {

            const respuesta = await fetch(
                `https://smbiomedic.onrender.com/api/usuarios/${usuario._id}/estado`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        activo: !usuario.activo
                    })
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    "Error al cambiar estado"
                );

            }


            await cargarUsuarios();


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Error al cambiar estado"
            );

        }

    };


    // =====================================================
    // ELIMINAR
    // =====================================================

    const eliminarUsuario = async (usuario) => {

        const confirmar = window.confirm(
            `¿Seguro que deseas eliminar al usuario "${usuario.usuario}"?`
        );


        if (!confirmar) {

            return;

        }


        try {

            const respuesta = await fetch(
                `https://smbiomedic.onrender.com/api/usuarios/${usuario._id}`,
                {
                    method: "DELETE"
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    "Error al eliminar usuario"
                );

            }


            setMensaje(
                "Usuario eliminado correctamente"
            );


            await cargarUsuarios();


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Error al eliminar usuario"
            );

        }

    };


    // =====================================================
    // NOMBRE DEL ROL
    // =====================================================

    const nombreRol = (rol) => {

        if (rol === "admin") {

            return "Administrador";

        }

        if (rol === "tecnico") {

            return "Técnico";

        }

        if (rol === "consulta") {

            return "Consulta";

        }

        return rol;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="p-6">

            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Usuarios
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Administración de usuarios del sistema.
                    </p>

                </div>


                <button
                    onClick={nuevoUsuario}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                >

                    + Nuevo usuario

                </button>

            </div>


            {/* ==========================================
                MENSAJES
            ========================================== */}

            {mensaje && (

                <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">

                    {mensaje}

                </div>

            )}


            {error && (

                <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">

                    {error}

                </div>

            )}


            {/* ==========================================
                FORMULARIO
            ========================================== */}

            {mostrarFormulario && (

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">

                    <h2 className="text-xl font-bold mb-5">

                        {editando
                            ? "Editar usuario"
                            : "Crear usuario"}

                    </h2>


                    <form
                        onSubmit={guardarUsuario}
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                            {/* NOMBRE */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">

                                    Nombre completo

                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={
                                        formulario.nombre
                                    }
                                    onChange={
                                        cambiarFormulario
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nombre del usuario"
                                />

                            </div>


                            {/* USUARIO */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">

                                    Usuario

                                </label>

                                <input
                                    type="text"
                                    name="usuario"
                                    value={
                                        formulario.usuario
                                    }
                                    onChange={
                                        cambiarFormulario
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nombre de usuario"
                                />

                            </div>


                            {/* CONTRASEÑA */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">

                                    Contraseña

                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formulario.password
                                    }
                                    onChange={
                                        cambiarFormulario
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        editando
                                            ? "Dejar vacío para conservar"
                                            : "Contraseña"
                                    }
                                />

                            </div>


                            {/* ROL */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">

                                    Rol

                                </label>

                                <select
                                    name="rol"
                                    value={
                                        formulario.rol
                                    }
                                    onChange={
                                        cambiarFormulario
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="consulta">
                                        Consulta
                                    </option>

                                    <option value="tecnico">
                                        Técnico
                                    </option>

                                    <option value="admin">
                                        Administrador
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* BOTONES */}

                        <div className="flex gap-3 mt-6">

                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                            >

                                {editando
                                    ? "Guardar cambios"
                                    : "Crear usuario"}

                            </button>


                            <button
                                type="button"
                                onClick={limpiarFormulario}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold"
                            >

                                Cancelar

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================================
                TABLA
            ========================================== */}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">

                {cargando ? (

                    <div className="p-8 text-center text-gray-500">

                        Cargando usuarios...

                    </div>

                ) : usuarios.length === 0 ? (

                    <div className="p-8 text-center">

                        <p className="text-gray-500">
                            No hay usuarios registrados.
                        </p>

                        <button
                            onClick={nuevoUsuario}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >

                            Crear primer usuario

                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Nombre
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Usuario
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Rol
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Estado
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr
                                        key={
                                            usuario._id
                                        }
                                        className="border-t hover:bg-gray-50"
                                    >

                                        {/* NOMBRE */}

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-gray-800">

                                                {usuario.nombre}

                                            </div>

                                        </td>


                                        {/* USUARIO */}

                                        <td className="px-6 py-4 text-gray-600">

                                            {usuario.usuario}

                                        </td>


                                        {/* ROL */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={
                                                    usuario.rol ===
                                                    "admin"
                                                        ? "px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                                                        : usuario.rol ===
                                                          "tecnico"
                                                        ? "px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                                                        : "px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                                }
                                            >

                                                {
                                                    nombreRol(
                                                        usuario.rol
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* ESTADO */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={
                                                    usuario.activo
                                                        ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                                                        : "px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                                                }
                                            >

                                                {usuario.activo
                                                    ? "Activo"
                                                    : "Inactivo"}

                                            </span>

                                        </td>


                                        {/* ACCIONES */}

                                        <td className="px-6 py-4">

                                            <div className="flex justify-center gap-2">


                                                {/* EDITAR */}

                                                <button
                                                    onClick={() =>
                                                        editarUsuario(
                                                            usuario
                                                        )
                                                    }
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                                                >

                                                    Editar

                                                </button>


                                                {/* ESTADO */}

                                                <button
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            usuario
                                                        )
                                                    }
                                                    className={
                                                        usuario.activo
                                                            ? "bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm"
                                                            : "bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                                                    }
                                                >

                                                    {usuario.activo
                                                        ? "Desactivar"
                                                        : "Activar"}

                                                </button>


                                                {/* ELIMINAR */}

                                                <button
                                                    onClick={() =>
                                                        eliminarUsuario(
                                                            usuario
                                                        )
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                                                >

                                                    Eliminar

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Usuarios;

