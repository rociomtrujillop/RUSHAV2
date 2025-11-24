import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto';

describe('Página de Contacto', () => {

  it('debe renderizar el formulario de contacto correctamente', () => {
    render(<Contacto />);
    
    // Verificamos que el título y los inputs principales existan
    expect(screen.getByRole('heading', { name: /Contacto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
  });

  it('debe permitir escribir en los campos del formulario', async () => {
    render(<Contacto />);
    const user = userEvent.setup();
    
    // Simulamos escribir en el campo de nombre
    const inputNombre = screen.getByLabelText(/Nombre completo/i);
    await user.type(inputNombre, 'Juan Pérez');

    // Verificamos que el valor cambió
    expect(inputNombre.value).toBe('Juan Pérez');
    
    // Simulamos escribir en el mensaje
    const textarea = screen.getByLabelText(/Mensaje/i);
    await user.type(textarea, 'Hola, esto es una prueba');
    expect(textarea.value).toBe('Hola, esto es una prueba');
  });
});