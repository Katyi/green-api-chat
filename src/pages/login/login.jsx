import React from 'react';
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const loginUser = data => {
    console.log(data)
    localStorage.setItem("idInstance", data.idInstance);
    localStorage.setItem("apiTokenInstance", data.apiTokenInstance);
    reset();
    navigate('/main');
  };

  return (
    <div className='container'>
      <h1>Ввести учетные данные GREEN-API</h1>
      <form onSubmit={handleSubmit(loginUser)} className='LoginForm'>
        <div className='loginFormDiv'>
          <label>idInstance: </label>
          <input 
            autoComplete='off'
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
            autoComplete='off' 
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