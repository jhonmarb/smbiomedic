import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registro() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [rol, setRol] = useState("tecnico");

    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const registrarUsuario = async (e) => {

        e.preventDefault();

        setMensaje("");

        if (password !== confirmarPassword) {
            setMensaje("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);

        try {

            const respuesta = await fetch(
                "http://localhost:4000/api/auth/registrar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre,
                        usuario,
                        password,
                        rol
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                setMensaje(
                    datos.mensaje ||
                    "No se pudo crear el usuario"
                );

                return;
            }

            setMensaje(
                "Usuario creado correctamente"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudo conectar con el servidor"
            );

        } finally {

            setCargando(false);
        }
    };

    return (

        <div>

            <h1>
                Crear cuenta
            </h1>

            <form onSubmit={registrarUsuario}>

                <div>

                    <label>
                        Nombre completo
                    </label>

                    <br />

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        placeholder="Nombre completo"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Usuario
                    </label>

                    <br />

                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) =>
                            setUsuario(e.target.value)
                        }
                        placeholder="Nombre de usuario"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Contraseña
                    </label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Contraseña"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Confirmar contraseña
                    </label>

                    <br />

                    <input
                        type="password"
                        value={confirmarPassword}
                        onChange={(e) =>
                            setConfirmarPassword(e.target.value)
                        }
                        placeholder="Repita la contraseña"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Tipo de usuario
                    </label>

                    <br />

                    <select
                        value={rol}
                        onChange={(e) =>
                            setRol(e.target.value)
                        }
                    >

                        <option value="tecnico">
                            Técnico
                        </option>

                        <option value="consulta">
                            Consulta
                        </option>

                    </select>

                </div>

                <br />

                <button
                    type="submit"
                    disabled={cargando}
                >

                    {cargando
                        ? "Registrando..."
                        : "Registrarse"
                    }

                </button>

            </form>

            {mensaje && (
                <p>
                    {mensaje}
                </p>
            )}

            <br />

            <button
                onClick={() => navigate("/login")}
            >
                Volver al inicio de sesión
            </button>

        </div>
    );
}

export default Registro;