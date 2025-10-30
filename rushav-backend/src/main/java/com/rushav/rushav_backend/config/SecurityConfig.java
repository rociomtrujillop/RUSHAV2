package com.rushav.rushav_backend.config;

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

@Configuration
@EnableWebSecurity 
public class SecurityConfig {

    // (Tu @Bean de PasswordEncoder se queda en AppConfig.java, eso está perfecto)

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permite cualquier origen
        configuration.setAllowedMethods(Arrays.asList("*")); // Permite todos los métodos (GET, POST, etc.)
        configuration.setAllowedHeaders(Arrays.asList("*")); // Permite todas las cabeceras
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF
            .cors(withDefaults()) // Habilita CORS usando tu Bean 'corsConfigurationSource'
            
            .authorizeHttpRequests(authz -> authz

                // --- 1. RUTAS PÚBLICAS (Cliente y Swagger) ---
                // Estas rutas son visibles para CUALQUIERA, sin autenticación.
                .requestMatchers(
                    "/", "/index.html", "/static/**", "/favicon.ico",
                    "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                    "/api-docs/**", "/swagger-config/**", "/swagger-resources/**", "/webjars/**"
                ).permitAll()
                
                // Endpoints de API públicos (Login, Registro, y ver productos/categorías)
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() // Registro de clientes
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll() // <-- ARREGLO PARA RUTAS PÚBLICAS
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll() // <-- ARREGLO PARA RUTAS PÚBLICAS
                .requestMatchers(HttpMethod.GET, "/api/archivos/descargar/**").permitAll()

                // --- 2. RUTAS PROTEGIDAS (Admin) ---
                // Todas las demás rutas que no sean las de arriba, requerirán autenticación.
                // Spring Security usará tu UserDetailsService (UsuarioServiceImpl) para validarlas.
                .requestMatchers("/api/dashboard/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAnyAuthority("admin", "super-admin")
                
                .requestMatchers(HttpMethod.POST, "/api/productos").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyAuthority("admin", "super-admin")
                
                .requestMatchers(HttpMethod.POST, "/api/categorias").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasAnyAuthority("admin", "super-admin")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasAnyAuthority("admin", "super-admin")

                .requestMatchers("/api/archivos/subir/**", "/api/archivos/eliminar/**").hasAnyAuthority("admin", "super-admin")

                // --- 3. CUALQUIER OTRA RUTA ---
                // Si no coincide con nada de lo anterior, deniégalo.
                .anyRequest().denyAll() 
            )
            
            // --- 4. HABILITA HTTP BASIC ---
            // Esto activa el filtro que usará tu UserDetailsService (UsuarioServiceImpl)
            // para validar las rutas protegidas.
            .httpBasic(withDefaults()); 

        return http.build();
    }
}