import React from 'react';

import { render, screen, fireEvent   } from '@testing-library/react';
import LoginPage from './pages/loginPage';
import CreateCourseDialog from './Components/CreateCourseDialog'
import { Provider } from 'react-redux';
import store from './store' 
import DeleteChannel from './Components/DeleteChannel';

describe('CreateCourseDialog Component', () => {
    const setup = () => {

    render(
      <Provider store={store}>
        <CreateCourseDialog />
      </Provider>
    );

    const openButton = screen.getByRole('button',{ name: '+' });
    
    return { openButton };
  };
  
  test('Открывается модальное окно', async () => {

    const { openButton } = setup();
    fireEvent.click(openButton);
    expect(screen.getByText('Создать курс')).toBeInTheDocument();
    expect(screen.getByLabelText('Введите название курса')).toBeInTheDocument();
  });

    test('Закрывается модальное окно', async () => {

    const { openButton} = setup();
    fireEvent.click(openButton);
    expect(screen.getByText('Создать курс')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Отмена');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Создать курс')).not.toBeInTheDocument();
  });
});


describe('DeleteChannel Component', () => {
    const setup = () => {

    render(
      <Provider store={store}>
        <DeleteChannel />
      </Provider>
    );

    const openButton = screen.getByRole('button',{ name: '-' });
    
    return { openButton };
  };
  
  test('Открывается модальное окно', async () => {

    const { openButton } = setup();
    fireEvent.click(openButton);
    expect(screen.getByText('Удалить курс?')).toBeInTheDocument();

  });

    test('Закрывается модальное окно', async () => {

    const { openButton} = setup();
    fireEvent.click(openButton);
    const closeButton = screen.getByText('Отмена');

    fireEvent.click(closeButton);
    expect(screen.queryByText('Удалить курс?')).not.toBeInTheDocument();
  });
});
// describe('LoginPage Component', () => {


//   const setup = () => {
//     global.window = Object.create(window);
//       Object.defineProperty(global.window, 'location', {
//         configurable: true,
//         writable: true,
//         value: {
//           href: '',
//         },
//       });
//     render(<LoginPage />);
  
//     const emailInput = screen.getByLabelText(/E-mail:/i);
//     const passwordInput = screen.getByLabelText(/Пароль:/i);
//     const submitButton = screen.getByRole('button', { name: /Войти/i });
    
//     return { emailInput, passwordInput, submitButton };
//   };
  
//     test('перенаправляет на главную страницу при правильном email', async () => {

//       const { emailInput, passwordInput, submitButton } = setup();
//       fireEvent.change(emailInput, { target: { value: 'manager@carschool.ru' } });
//       fireEvent.change(passwordInput, { target: { value: 'manager123' } });
//       fireEvent.submit(submitButton);

//        expect(window.location.href).toBe('/main');

//   });

//   test('should display error message when email is "123"', () => {
//     const { emailInput, passwordInput, submitButton } = setup();
//     fireEvent.change(emailInput, { target: { value: '123' } });
//     fireEvent.change(passwordInput, { target: { value: 'any_password' } });
//     fireEvent.submit(submitButton);
//     expect(screen.getByText('Error')).toBeInTheDocument();
//   });

// });