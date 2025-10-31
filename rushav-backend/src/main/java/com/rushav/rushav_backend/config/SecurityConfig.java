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
            .csrf(csrf -> csrf.disable()) 
            .cors(withDefaults()) 
            
            .authorizeHttpRequests(authz -> authz

                .requestMatchers(
                    "/", "/index.html", "/static/**", "/favicon.ico",
                    "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                    "/api-docs/**", "/swagger-config/**", "/swagger-resources/**", "/webjars/**"
                ).permitAll()
                
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/archivos/descargar/**").permitAll()

                
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

                .anyRequest().denyAll() 
            )
            
            .httpBasic(withDefaults()); 

        return http.build();
    }
}