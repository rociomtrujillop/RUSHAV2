import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto';

describe('Página de Contacto', () => {

  it('debe renderizar el formulario de contacto', () => {
    render(<Contacto />);
    
    // Verificamos que el título y los campos existan
    expect(screen.getByRole('heading', { name: /Contacto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre completo \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje \*/i)).toBeInTheDocument();
  });

  it('debe mostrar errores de validación si el formulario está vacío', async () => {
    render(<Contacto />);
    const user = userEvent.setup();

    // Simula un clic en el botón de enviar
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    // Busca los mensajes de error
    expect(await screen.findByText(/El nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El correo es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El mensaje es obligatorio/i)).toBeInTheDocument();
  });

  it('debe mostrar un error de correo inválido', async () => {
    render(<Contacto />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Nombre completo \*/i), 'Tester');
    await user.type(screen.getByLabelText(/Correo electrónico \*/i), 'correo@invalido.com');
    await user.type(screen.getByLabelText(/Mensaje \*/i), 'Un mensaje');

    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    // Busca el error específico del correo
    expect(await screen.findByText(/El correo debe ser @duoc.cl/i)).toBeInTheDocument();
  });
  
  it('debe actualizar el estado y el contador al escribir en el mensaje', async () => {
    render(<Contacto />);
    const user = userEvent.setup();
    
    const textarea = screen.getByLabelText(/Mensaje \*/i);
    await user.type(textarea, 'Hola mundo');

    // Verifica que el estado del textarea se actualizó
    expect(textarea.value).toBe('Hola mundo');
    
    // Verifica que el contador de caracteres se actualizó
    expect(screen.getByText('10 / 500')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de éxito al enviar un formulario válido', async () => {
    render(<Contacto />);
    const user = userEvent.setup();

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'setItem');

    await user.type(screen.getByLabelText(/Nombre completo \*/i), 'Tester');
    await user.type(screen.getByLabelText(/Correo electrónico \*/i), 'test@gmail.com');
    await user.type(screen.getByLabelText(/Mensaje \*/i), 'Un mensaje válido');
    
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    // Verifica el mensaje de éxito
    expect(await screen.findByText('Mensaje enviado correctamente')).toBeInTheDocument();
    
    // Verifica que los campos se limpiaron
    expect(screen.getByLabelText(/Nombre completo \*/i).value).toBe('');
    
    // Verifica que se llamó a localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'mensajesContacto',
      expect.stringContaining('test@gmail.com')
    );
  });
});