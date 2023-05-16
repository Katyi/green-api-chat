import React from 'react';
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const loginUser = data => {
    console.log(data)
    localStorage.setItem("username", data.username);
    localStorage.setItem("idInstance", data.idInstance);
    localStorage.setItem("apiTokenInstance", data.apiTokenInstance);
    reset();
    navigate('/main');
  };

  return (
    <div className='container'>
      <h1>Авторизация пользователя</h1>
      <form onSubmit={handleSubmit(loginUser)} className='LoginForm'>
        <div className='loginFormDiv'>
          <label>Имя пользователя: </label>
          <input 
            type="text" {...register("username", 
            {
              required: "Поле обязательно к заполнению",
              minLength: {value: 2, message: "Минимум 2 символa"},
              maxLength: {value: 40, message: "Максимум 40 символов"},
            })} 
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        <div className='loginFormDiv'>
          <label>idInstance: </label>
          <input 
            type="number" {...register("idInstance", 
            {
              required: "Поле обязательно к заполнению",
            })}
          />
          {errors.idInstance && <span>{errors.idInstance.message}</span>}
        </div>
        <div className='loginFormDiv'>
          <label>apiTokenInstance: </label>
          <input 
            type="text" {...register("apiTokenInstance", 
            {
              required: "Поле обязательно к заполнению",
              minLength: {value: 2, message: "Минимум 2 символa"},
            })}
          />
          {errors.apiTokenInstance && <span>{errors.apiTokenInstance.message}</span>}
        </div>
          <button type='submit' className='loginFormButton'>
            Войти
          </button>
      </form>
    </div>
  )
};

export default Login;