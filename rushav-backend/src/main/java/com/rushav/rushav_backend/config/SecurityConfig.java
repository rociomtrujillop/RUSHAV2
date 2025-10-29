package com.rushav.rushav_backend.config;

// Imports para SecurityFilterChain y CORS
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;
import java.util.Arrays;

// --- NOTA: Ya no se importan PasswordEncoder ni BCryptPasswordEncoder ---

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // --- El @Bean de PasswordEncoder se eliminó de aquí ---
    //     (Porque ahora está en AppConfig.java)

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite peticiones desde cualquier origen (para desarrollo)
        configuration.setAllowedOrigins(Arrays.asList("*")); 
        // Permite todos los métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("*"));
        // Permite todas las cabeceras
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a todas las rutas
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz

                // --- Permitir Acceso a Recursos Estáticos Comunes y Swagger ---
                .requestMatchers(
                    "/",                          // Permitir la raíz
                    "/index.html",                // Común para SPAs
                    "/static/**",                 // Recursos estáticos
                    "/favicon.ico",
                    "/manifest.json",
                    "/logo*.png",
                    "/swagger-ui.html",           // Página principal de Swagger UI (de tu properties)
                    "/swagger-ui/**",             // Recursos de Swagger UI
                    "/v3/api-docs/**",            // Definición OpenAPI (Estándar, por si acaso)
                    "/api-docs/**",               // <-- ¡¡ESTA ES LA LÍNEA CLAVE!! (de tu properties)
                    "/swagger-config/**",         // (Por si acaso, basado en errores anteriores)
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()

                // --- RUTAS PÚBLICAS API ---
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/archivos/descargar/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() // Registro

                // --- RUTAS DE ADMINISTRADOR ---
                // (Aquí van todas tus reglas de .hasAnyAuthority(...))
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")

                .requestMatchers(HttpMethod.POST, "/api/productos").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyAuthority("admin", "super-admin")

                .requestMatchers(HttpMethod.POST, "/api/categorias").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasAnyAuthority("admin", "super-admin")

                .requestMatchers("/api/dashboard/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers("/api/archivos/subir/**", "/api/archivos/eliminar/**").hasAnyAuthority("admin", "super-admin")


                .anyRequest().denyAll()
            )
            .cors(withDefaults()); 

        return http.build();
    }
}