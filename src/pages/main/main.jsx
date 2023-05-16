import React, { useCallback, useEffect, useState } from 'react';
import {useForm} from 'react-hook-form';

const Main = () => {
  let username = localStorage.getItem("username");
  let idInstance = localStorage.getItem("idInstance");
  let apiTokenInstance = localStorage.getItem("apiTokenInstance");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, reset: reset2, formState: { errors: errors2 }} = useForm();
  let [messages, setMessages] = useState([]);
  let i = 0;

  const beginChat = data => {
    setShowInput(false);
    setShowPhoneNumber(true);
    setPhoneNumber(data.phone);
  };

  const sendMessage = data => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      "chatId": `${phoneNumber}@c.us`,
      "message": `${data.message}`
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        if (result) {
          console.log("done!")
          setMessages((prev)=>[...prev, {typeOfMessage: "out", message: data.message}]);
          console.log(messages);
        }
      })

      .catch(error => console.log('error', error));      
      reset2();

  };

  const receiveMessage = (i) => {
    i = i + 1;
    let requestOptions = {
      method: 'GET',
    };

    fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, requestOptions)
      .then(response => response.text())
      .then(result => {
         console.log('result '+ result);
         console.log('result '+ typeof result);
        if (result === "null") {
          console.log("выход")
          throw new Error("Ошибка");
        }
        let resMessage;
        let receiptId;
        if (JSON.parse(result).body.messageData.typeMessage === 'textMessage') {
            resMessage = JSON.parse(result).body.messageData.textMessageData.textMessage;
            receiptId = JSON.parse(result).receiptId;
            setMessages((prev)=>[...prev, {typeOfMessage: "input", message: resMessage}]);
            console.log(messages);
            console.log(receiptId);
            deletereceivedMessage(receiptId);
          } else {
            throw new Error("Ошибка");
          };
      })
      .catch(error => console.log('error', error));
      
  };

  const deletereceivedMessage = (receiptId) => {
    let requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  
  useEffect(() => {
    // setTimeout(console.log(i), 20000);
    setInterval(() => receiveMessage(i), 20000);
    
  },[i])

  return (
    <div className='container'>
      {/* Header */}
      <div className='header'>
        <img src="/images/arrow_back.png" alt="" className='back-arrow-img' />
        <div className='usernameInHeader'>{username}</div>
        {!showInput && phoneNumber ==="" &&
          <button className='chat-icon-btn' onClick={()=>setShowInput(true)}>
            <img src="/images/chat-icon.png" alt="" className='chat-icon-img' />
          </button>
        }
        {showInput &&
        <form key={1} onSubmit={handleSubmit(beginChat)} className='LoginForm'>
          <div>
            <label>Введите номер телефона: </label>
            <input
              className='phoneNumberInput'
              placeholder="79269999999"
              type="number" {...register("phone",
              {
                required: "Поле обязательно к заполнению",
                minLength: {value: 11, message: "Минимум 11 символa"},
                maxLength: {value: 11, message: "Максимум 11 символов"},
              })} 
            />
            {errors.phone && <span>{errors.phone.message}</span>}
            <button className='mainFormButton'>Ok</button>
          </div>
         </form>
        }
        {showPhoneNumber &&
          <div className='phoneNumber'>to {phoneNumber}</div>
        }
      </div>

      {/* Messages show part */}
      <div className='messages'>
        {messages.map((item, index)=>{
          return <div 
            key={index} 
            className={item.typeOfMessage === 'out' ? 'outMessage' : 'inputMessage'}
            >
              {item.typeOfMessage === 'out' ? item.message : item.message}
            </div>
          })
        }
      </div>

      {/* Footer for sending messages */}
      <div className='footer'>
        <form key={2} onSubmit={handleSubmit2(sendMessage)} className='MessageForm'>
          <input
            placeholder='Ваше сообщение...'
            className='messageInput'
            type="text" {...register2("message",
              {
                required: "Поле обязательно к заполнению",
                minLength: {value: 1, message: "Минимум 1 символa"},
                maxLength: {value: 100, message: "Максимум 100 символов"},
              })}
          />
          {errors2.message && <span>{errors2.message.message}</span>}
          <button className='chat-icon-btn'>
            <img src="/images/send-message.png" alt="" className='chat-icon-img' />
          </button>
        </form>

      </div>
    </div>
  )
}

export default Main;