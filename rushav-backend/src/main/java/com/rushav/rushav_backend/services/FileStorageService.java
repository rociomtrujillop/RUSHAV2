package com.rushav.rushav_backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public String almacenarArchivo(MultipartFile archivo) throws IOException {
        Path directorioUpload = Paths.get(uploadDir);
        if (!Files.exists(directorioUpload)) {
            Files.createDirectories(directorioUpload);
        }

        String nombreOriginal = archivo.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        }
        
        String nombreArchivo = UUID.randomUUID().toString() + extension;

        Path rutaArchivo = directorioUpload.resolve(nombreArchivo);
        Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        return nombreArchivo;
    }

    public byte[] cargarArchivo(String nombreArchivo) throws IOException {
        Path rutaArchivo = Paths.get(uploadDir).resolve(nombreArchivo);
        if (Files.exists(rutaArchivo)) {
            return Files.readAllBytes(rutaArchivo);
        }
        return null;
    }

    public boolean eliminarArchivo(String nombreArchivo) throws IOException {
        Path rutaArchivo = Paths.get(uploadDir).resolve(nombreArchivo);
        if (Files.exists(rutaArchivo)) {
            Files.delete(rutaArchivo);
            return true;
        }
        return false;
    }
}