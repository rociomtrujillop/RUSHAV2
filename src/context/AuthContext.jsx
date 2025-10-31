import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const API_URL = "http://localhost:8080";
const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "usuario";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // (useEffect para cargar desde localStorage)
  useEffect(() => {
    try {
      const storedUserString = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedUserString && storedToken) {
        const storedUserData = JSON.parse(storedUserString);
        if (storedUserData && storedUserData.id && storedToken) {
          setCurrentUser(storedUserData);
          setAuthToken(storedToken);
        } else {
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error("Error al leer localStorage:", error);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  // (Función login)
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || "Credenciales incorrectas");
      }
      if (data && data.usuarios && data.usuarios.id) {
        const basicToken = "Basic " + btoa(`${email}:${password}`);
        localStorage.setItem(USER_KEY, JSON.stringify(data.usuarios));
        localStorage.setItem(AUTH_TOKEN_KEY, basicToken);
        setCurrentUser(data.usuarios);
        setAuthToken(basicToken);
        return data.usuarios;
      } else {
        throw new Error("Respuesta de login inválida.");
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  // (Función logout - sin cambios)
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setCurrentUser(null);
      setAuthToken(null);
    } catch (error) {
      console.error("Error al limpiar localStorage:", error);
      setCurrentUser(null);
      setAuthToken(null);
    }
  }, []);

  // --- fetchProtegido (para JSON) 
  const fetchProtegido = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      logout();
      throw new Error("Usuario no autenticado.");
    }
    const headers = {
      ...options.headers,
      "Authorization": token,
      "Content-Type": "application/json"
    };
    const response = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (!response.ok) {
      const errorBody = await response.text(); // Lee el error como texto
      // Esto mostrará "El email ya está registrado"
      throw new Error(errorBody || `Error ${response.status}`);
    }
    
    if (response.status === 204) { // No Content (para DELETE)
        return { ok: true };
    }
    
    // Si todo está OK, leemos el JSON
    return response.json();
  }, [logout]);

  // --- fetchProtegidoArchivo (para FormData) ---
  const fetchProtegidoArchivo = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      logout();
      throw new Error("Usuario no autenticado.");
    }
    const headers = { ...options.headers, "Authorization": token };
    const response = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || `Error ${response.status}`);
    }
    
    // <-- CAMBIO 2: LEEMOS LA RESPUESTA COMO TEXTO (LA URL)
    return response.text();
  }, [logout]);


  const value = {
    currentUser,
    isLoggedIn: !!currentUser && !!authToken,
    login,
    logout,
    fetchProtegido,
    fetchProtegidoArchivo,
    loadingAuth
  };

  if (loadingAuth) {
    return <div>Verificando sesión...</div>;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}