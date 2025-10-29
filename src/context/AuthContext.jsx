// src/context/AuthContext.jsx (Refinado con más Logs y Verificaciones)

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); // Renombrado para claridad

  // --- Efecto para verificar localStorage al inicio ---
  useEffect(() => {
    console.log("[AuthContext] useEffect: Verificando localStorage...");
    setLoadingAuth(true); // Asegura que estemos en estado de carga
    try {
      const storedUserString = localStorage.getItem('usuario');
      if (storedUserString) {
        const storedUserData = JSON.parse(storedUserString);
        // Espera la estructura { mensaje: ..., usuarios: { ... } }
        if (storedUserData && storedUserData.usuarios && storedUserData.usuarios.id) { // Verifica ID como mínimo
          console.log("[AuthContext] useEffect: Usuario encontrado y válido en localStorage:", storedUserData.usuarios);
          setCurrentUser(storedUserData.usuarios);
        } else {
          console.warn("[AuthContext] useEffect: Estructura inválida en localStorage, limpiando.");
          localStorage.removeItem('usuario');
          setCurrentUser(null); // Asegura que currentUser sea null si los datos son malos
        }
      } else {
        console.log("[AuthContext] useEffect: No hay usuario en localStorage.");
        setCurrentUser(null); // Asegura que currentUser sea null
      }
    } catch (error) {
      console.error("[AuthContext] useEffect: Error al leer/parsear localStorage:", error);
      localStorage.removeItem('usuario');
      setCurrentUser(null); // Asegura que currentUser sea null en caso de error
    } finally {
      console.log("[AuthContext] useEffect: Verificación inicial completada.");
      setLoadingAuth(false); // Terminamos la carga inicial
    }
  }, []); // Solo se ejecuta al montar

  // --- Función Login ---
  const login = (userDataResponse) => {
    console.log("[AuthContext] login: Intentando iniciar sesión con:", userDataResponse);
    // Verifica la estructura esperada { mensaje: ..., usuarios: { ... } }
    if (userDataResponse && userDataResponse.usuarios && userDataResponse.usuarios.id) { // Verifica ID
      try {
        localStorage.setItem('usuario', JSON.stringify(userDataResponse)); // Guarda toda la respuesta
        setCurrentUser(userDataResponse.usuarios); // Actualiza el estado del contexto
        console.log("[AuthContext] login: Estado currentUser actualizado:", userDataResponse.usuarios);
        return userDataResponse.usuarios; // Devuelve el objeto usuario
      } catch (error) {
          console.error("[AuthContext] login: Error al guardar en localStorage:", error);
          // Limpia por seguridad si falla el guardado
          localStorage.removeItem('usuario');
          setCurrentUser(null); 
          return null;
      }
    } else {
        console.error("[AuthContext] login: Datos de respuesta inválidos:", userDataResponse);
        // Asegurarse de limpiar si los datos son malos
        localStorage.removeItem('usuario');
        setCurrentUser(null);
        return null;
    }
  };

  // --- Función Logout ---
  const logout = () => {
    console.log("[AuthContext] logout: Cerrando sesión...");
    try {
        localStorage.removeItem('usuario');
        setCurrentUser(null); // Actualiza el estado del contexto
        console.log("[AuthContext] logout: Estado currentUser limpiado.");
    } catch (error) {
        console.error("[AuthContext] logout: Error al limpiar localStorage:", error);
        // Aunque falle la limpieza, actualizamos el estado local
        setCurrentUser(null);
    }
  };

  // Valor del contexto
  const value = {
    currentUser,
    isLoggedIn: !!currentUser, 
    login,
    logout,
    loadingAuth 
  };

  // --- Renderizado Condicional de Carga ---
  // Muestra "Verificando..." solo mientras loadingAuth es true
  if (loadingAuth) {
    console.log("[AuthContext] Render: Mostrando estado de carga...");
    // Puedes poner un spinner de Bootstrap aquí si prefieres
    return <div>Verificando sesión...</div>; 
  }

  console.log("[AuthContext] Render: Proveedor listo, currentUser:", currentUser); // Log final antes de renderizar hijos
  // Renderiza los hijos solo cuando la carga inicial ha terminado
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook Personalizado (sin cambios)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}