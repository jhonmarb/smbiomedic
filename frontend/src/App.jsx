import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Mantenimientos from "./pages/Mantenimientos";
import Intervenciones from "./pages/Intervenciones";
import Maquinas from "./pages/Maquinas";
import Usuarios from "./pages/Usuarios";

import Layout from "./components/Layout";


// =====================================================
// PROTEGER LAS RUTAS
// =====================================================

function RutaProtegida() {

    const location = useLocation();

    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    desde: location.pathname
                }}
            />
        );
    }

    return <Layout />;
}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================================
                    LOGIN
                ===================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================
                    REGISTRO
                ===================================== */}

                <Route
                    path="/registro"
                    element={<Registro />}
                />


                {/* =====================================
                    RUTAS PROTEGIDAS
                ===================================== */}

                <Route
                    element={<RutaProtegida />}
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/mantenimientos"
                        element={<Mantenimientos />}
                    />

                    <Route
                        path="/intervenciones"
                        element={<Intervenciones />}
                    />

                    <Route
                        path="/maquinas"
                        element={<Maquinas />}
                    />

                    <Route
                        path="/usuarios"
                        element={<Usuarios />}
                    />

                </Route>


                {/* =====================================
                    RUTA PRINCIPAL
                ===================================== */}

                <Route
                    path="/"
                    element={
                        localStorage.getItem("token")
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                />


                {/* =====================================
                    RUTA NO ENCONTRADA
                ===================================== */}

                <Route
                    path="*"
                    element={
                        localStorage.getItem("token")
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;