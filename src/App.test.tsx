import React from 'react';

import { render, screen, fireEvent   } from '@testing-library/react';
import LoginPage from './pages/loginPage';


describe('LoginPage Component', () => {


  const setup = () => {
    global.window = Object.create(window);
      Object.defineProperty(global.window, 'location', {
        configurable: true,
        writable: true,
        value: {
          href: '',
        },
      });
    render(<LoginPage />);
  
    const emailInput = screen.getByLabelText(/E-mail:/i);
    const passwordInput = screen.getByLabelText(/Пароль:/i);
    const submitButton = screen.getByRole('button', { name: /Войти/i });
    
    return { emailInput, passwordInput, submitButton };
  };
  
    test('перенаправляет на главную страницу при правильном email', async () => {

      const { emailInput, passwordInput, submitButton } = setup();
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(submitButton);

       expect(window.location.href).toBe('/main');

  });

  test('should display error message when email is "123"', () => {
    const { emailInput, passwordInput, submitButton } = setup();
    fireEvent.change(emailInput, { target: { value: '123' } });
    fireEvent.change(passwordInput, { target: { value: 'any_password' } });
    fireEvent.submit(submitButton);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });




});