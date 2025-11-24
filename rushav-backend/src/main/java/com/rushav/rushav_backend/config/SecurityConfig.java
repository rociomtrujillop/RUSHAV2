package com.rushav.rushav_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .authorizeHttpRequests(authz -> authz
                // 1. DOCUMENTACIÓN SWAGGER (PÚBLICO)
                .requestMatchers(
                    "/", "/index.html", "/static/**", "/favicon.ico",
                    "/swagger-ui.html", "/swagger-ui/**", 
                    "/v3/api-docs/**", "/api-docs/**", 
                    "/swagger-resources/**", "/webjars/**"
                ).permitAll()
                
                // 2. AUTENTICACIÓN Y REGISTRO (PÚBLICO)
                .requestMatchers("/api/auth/**").permitAll() 
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() 
                .requestMatchers(HttpMethod.POST, "/api/pedidos").permitAll() 
                // -------------------------------------------

                // 3. VITRINA PÚBLICA (Solo lectura GET)
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/archivos/descargar/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/pedidos/usuario/**").hasAnyAuthority("user", "admin", "super-admin")

                // 4. PANEL DE ADMIN (PROTEGIDO)
                .requestMatchers("/api/**").hasAnyAuthority("admin", "super-admin")

                // 5. RESTO
                .anyRequest().authenticated()
            )
            // Configuración para JWT (Sin estado / Stateless)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- LOS SIGUIENTES BEANS SE QUEDAN IGUAL ---

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permitir todo origen (para desarrollo)
        configuration.setAllowedMethods(Arrays.asList("*")); // GET, POST, PUT, DELETE, etc.
        configuration.setAllowedHeaders(Arrays.asList("*")); // Authorization, Content-Type, etc.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}