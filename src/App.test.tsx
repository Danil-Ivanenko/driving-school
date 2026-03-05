import React from 'react';

import { render, screen, fireEvent   } from '@testing-library/react';
import LoginPage from './pages/loginPage';
import CreateCourseDialog from './Components/Dialogs/CreateCourseDialog'
import { Provider } from 'react-redux';
import store from './store' 
import DeleteChannel from './Components/Dialogs/DeleteChannelDialog';
import CreatePostDialog from './Components/Dialogs/CreatePostDialog';
import DeletePostDialog from './Components/Dialogs/DeletePostDialog';
import CreateUserDialog from './Components/Dialogs/CreateUserDialog';


describe('DeletePostDialog Component', () => {
    const setup = () => {

    render(
      <Provider store={store}>
        <DeletePostDialog />
      </Provider>
    );

    const openButton = screen.getByRole('button',{ name: '-' });
    
    return { openButton };
  };
  
  test('Открывается модальное окно', async () => {

    const { openButton } = setup();
    fireEvent.click(openButton);
    expect(screen.getByText('Удалить пост?')).toBeInTheDocument();

  });

    test('Закрывается модальное окно', async () => {

    const { openButton} = setup();
    fireEvent.click(openButton);
    const closeButton = screen.getByText('Отмена');

    fireEvent.click(closeButton);
    expect(screen.queryByText('Удалить пост?')).not.toBeInTheDocument();
  });
});


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


describe('CreatePostDialog Component', () => {
    const setup = () => {

    render(
      <Provider store={store}>
        <CreatePostDialog />
      </Provider>
    );

    const openButton = screen.getByText( 'Создать запись' );
    
    return { openButton };
  };
  
  test('Открывается модальное окно', async () => {

    const { openButton } = setup();
    fireEvent.click(openButton);
    expect(screen.getByText('Название записи*')).toBeInTheDocument();

  });

    test('Закрывается модальное окно', async () => {

    const { openButton} = setup();
    fireEvent.click(openButton);
    const closeButton = screen.getByText('Отмена');

    fireEvent.click(closeButton);
    expect(screen.queryByText('Название записи*')).not.toBeInTheDocument();
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

describe('CreateUserDialog Component', () => {
    const setup = () => {
        render(
            <Provider store={store}>
                <CreateUserDialog />
            </Provider>
        );

        const openButton = screen.getByRole('button', { name: '+' });
        
        return { openButton };
    };
    
    test('Открывается модальное окно', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        expect(screen.getByText('Создать пользователя')).toBeInTheDocument();
        
        expect(screen.getByLabelText('Имя *')).toBeInTheDocument();
        expect(screen.getByLabelText('Фамилия *')).toBeInTheDocument();
        expect(screen.getByLabelText('Email *')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль *')).toBeInTheDocument();
        expect(screen.getByLabelText('Возраст *')).toBeInTheDocument();
        expect(screen.getByLabelText('Телефон *')).toBeInTheDocument();
        
        expect(screen.getByLabelText('Студент')).toBeInTheDocument();
        expect(screen.getByLabelText('Преподаватель')).toBeInTheDocument();
        expect(screen.getByLabelText('Менеджер')).toBeInTheDocument();
        
        expect(screen.getByText('Создать')).toBeInTheDocument();
        expect(screen.getByText('Отмена')).toBeInTheDocument();
    });

    test('Закрывается модальное окно при нажатии Отмена', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        expect(screen.getByText('Создать пользователя')).toBeInTheDocument();
        
        const closeButton = screen.getByText('Отмена');
        fireEvent.click(closeButton);
        
        expect(screen.queryByText('Создать пользователя')).not.toBeInTheDocument();
    });

    test('Закрывается модальное окно при клике на оверлей', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        expect(screen.getByText('Создать пользователя')).toBeInTheDocument();
        
        const overlay = document.querySelector('.modalOverlay');
        expect(overlay).toBeInTheDocument();
        if (overlay) {
            fireEvent.click(overlay);
        }

        expect(screen.queryByText('Создать пользователя')).not.toBeInTheDocument();
    });

    test('Валидация - показывает ошибку при коротком имени', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);

        const nameInput = screen.getByLabelText('Имя *');
        fireEvent.change(nameInput, { target: { value: 'A' } });

        fireEvent.change(screen.getByLabelText('Фамилия *'), { target: { value: 'Иванов' } });
        fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Пароль *'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Возраст *'), { target: { value: 25 } });
        fireEvent.change(screen.getByLabelText('Телефон *'), { target: { value: '+79991234567' } });

        const createButton = screen.getByText('Создать');
        fireEvent.click(createButton);
        
        expect(screen.getByText('Имя должно содержать минимум 2 символа')).toBeInTheDocument();
        expect(screen.getByText('Создать пользователя')).toBeInTheDocument();
    });

    test('Валидация - показывает ошибку при некорректном email', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        fireEvent.change(screen.getByLabelText('Имя *'), { target: { value: 'Иван' } });
        fireEvent.change(screen.getByLabelText('Фамилия *'), { target: { value: 'Иванов' } });
        fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Пароль *'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Возраст *'), { target: { value: 25 } });
        fireEvent.change(screen.getByLabelText('Телефон *'), { target: { value: '+79991234567' } });
        
        const createButton = screen.getByText('Создать');
        fireEvent.click(createButton);
        
        expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
    });

    test('Валидация - показывает ошибку при коротком пароле', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        fireEvent.change(screen.getByLabelText('Имя *'), { target: { value: 'Иван' } });
        fireEvent.change(screen.getByLabelText('Фамилия *'), { target: { value: 'Иванов' } });
        fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Пароль *'), { target: { value: '123' } });
        fireEvent.change(screen.getByLabelText('Возраст *'), { target: { value: 25 } });
        fireEvent.change(screen.getByLabelText('Телефон *'), { target: { value: '+79991234567' } });
        
        const createButton = screen.getByText('Создать');
        fireEvent.click(createButton);
        
        expect(screen.getByText('Пароль должен быть не менее 6 символов')).toBeInTheDocument();
    });

    test('Выбор нескольких ролей работает', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);

        const studentCheckbox = screen.getByLabelText('Студент');
        const teacherCheckbox = screen.getByLabelText('Преподаватель');
        const managerCheckbox = screen.getByLabelText('Менеджер');

        expect(studentCheckbox).toBeChecked();
        expect(teacherCheckbox).not.toBeChecked();
        expect(managerCheckbox).not.toBeChecked();

        fireEvent.click(teacherCheckbox);
        expect(teacherCheckbox).toBeChecked();
        expect(studentCheckbox).toBeChecked();

        fireEvent.click(managerCheckbox);
        expect(managerCheckbox).toBeChecked();
        
        fireEvent.click(studentCheckbox);
        expect(studentCheckbox).not.toBeChecked();
        expect(teacherCheckbox).toBeChecked();
        expect(managerCheckbox).toBeChecked();
    });

    test('Сбрасывается форма после закрытия', async () => {
        const { openButton } = setup();
        fireEvent.click(openButton);
        
        fireEvent.change(screen.getByLabelText('Имя *'), { target: { value: 'Иван' } });
        fireEvent.change(screen.getByLabelText('Фамилия *'), { target: { value: 'Иванов' } });
        
        const closeButton = screen.getByText('Отмена');
        fireEvent.click(closeButton);
        
        fireEvent.click(openButton);
        
        expect(screen.getByLabelText('Имя *')).toHaveValue('');
        expect(screen.getByLabelText('Фамилия *')).toHaveValue('');
        expect(screen.getByLabelText('Студент')).toBeChecked();
    });
});