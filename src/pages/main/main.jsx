import React, { useEffect, useState } from 'react';
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import img1 from '../../images/arrow_back.png';
import img2 from '../../images/chat-icon.png';
import img3 from '../../images/ok-icon.png';
import img4 from '../../images/send-message.png';

const Main = () => {
  const navigate = useNavigate();
  let idInstance = localStorage.getItem("idInstance");
  let apiTokenInstance = localStorage.getItem("apiTokenInstance");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberList, setPhoneNumberList] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, reset: reset2, formState: { errors: errors2 }} = useForm();
  let [messages, setMessages] = useState([]);
  let ind = 0;

  const startChat = data => {
    setShowInput(false);
    setShowPhoneNumber(true);
    setPhoneNumber(data.phone);
    setPhoneNumberList((prev)=>[...prev, data.phone]);
    reset();
  };

  const changeChat = (e) => {
    setPhoneNumber((prev)=>e.target.innerHTML);
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
          setMessages((prev)=>[...prev, {typeOfMessage: "out", message: data.message, receiver: phoneNumber}]);
          console.log(messages);
        }
      })
      .catch(error => console.log('error', error));      
      reset2();
  };

  const receiveMessage = (ind) => {
    ind = ind + 1;
    let requestOptions = {
      method: 'GET',
    };

    fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result === "null") {
          throw new Error("Сообщений нет");
        }
        let receiptId = JSON.parse(result).receiptId;
        console.log(receiptId);
        if (JSON.parse(result).body.typeWebhook !== 'incomingMessageReceived') {
          deletereceivedMessage(receiptId);
          throw new Error("Не того типа сообщение!!!");
        }
        let resMessage;
        let resSender;
        if (JSON.parse(result).body.messageData.typeMessage === 'textMessage') {
          resMessage = JSON.parse(result).body.messageData.textMessageData.textMessage;
          resSender = JSON.parse(result).body.senderData.sender.slice(0, 11);
          setMessages((prev)=>[...prev, {typeOfMessage: "input", message: resMessage, sender: resSender}]);
          console.log(messages);
          console.log(resSender);
          deletereceivedMessage(receiptId);
        } else if (JSON.parse(result).body.messageData.typeMessage === 'extendedTextMessage') {
          resMessage = JSON.parse(result).body.messageData.extendedTextMessageData.text;
          resSender = JSON.parse(result).body.senderData.sender.slice(0, 11);
          setMessages((prev)=>[...prev, {typeOfMessage: "input", message: resMessage, sender: resSender}]);
          console.log(messages);
          console.log(resSender);
          deletereceivedMessage(receiptId);
        } else {
          deletereceivedMessage(receiptId);
          throw new Error("Не текстовое сообщение");
        };
      })
      .catch(error => console.log(error));
  };

  const deletereceivedMessage = (receiptId) => {
    let requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log(error));
  };
  
  useEffect(() => {
    setInterval(() => receiveMessage(ind), 5000);
  },[ind])

  return (
    <div className='container'>
      {/* Header */}
      <div className='header'>
        <div className='headerLeftSideIcons'>  
        <img src={img1} className='back-arrow-img' onClick={()=>navigate('/')}/>
        {!showInput &&
          <button className='chat-icon-btn' onClick={()=>setShowInput(true)}>
            <div className='tooltip'>
            <img src={img2} alt="" className='chat-icon-img'/>
            <span className="tooltiptext">Новый чат</span>
            </div>
          </button>
        }
        {showInput &&
        <form key={1} onSubmit={handleSubmit(startChat)} className='phoneForm'>
          <label>Введите номер телефона: </label>
          <input
            className='phoneNumberInput'
            placeholder="79269999999"
            autoComplete='off'
            type="number" {...register("phone",
            {
              required: "Поле не заполнено",
              minLength: {value: 11, message: "11 символов"},
              maxLength: {value: 11, message: "11 символов"},
              validate: value=> !phoneNumberList.includes(value) || "Такой номер уже есть в списке!"
            })} 
          />
          {errors.phone && <span>{errors.phone.message}</span>}
          <button className='chat-icon-btn'>
            <img src={img3} alt="" className='chat-icon-img ok-icon'/>
          </button>
         </form>
        }
        </div>
        {showPhoneNumber &&
          <div className='phoneNumber'>{phoneNumber}</div>
        }
      </div>
      {/* main part */}
      <div className='main'>
        {/* sidebar */}
        <div className='sidebar'>
          <h3>Контакты</h3>
          {phoneNumberList.map((item, index)=> {
            return <div key={index} className='contact'
            onClick={(e)=>changeChat(e)}
            >
              {item}
            </div>
          })}
        </div>
        {/* Messages part */}
        <div className='messages'>
          {messages.filter((item, index)=> (item.sender === phoneNumber && item.typeOfMessage === 'input') || (item.receiver === phoneNumber && item.typeOfMessage === 'out'))
          .map((item, index)=>{
            return <div 
              key={index} 
              className={item.typeOfMessage === 'out' ? 'outMessage' : 'inputMessage'}
              >
                {item.message}
              </div>
            })
          }
        </div>
      </div>
      
      {/* Footer for sending messages */}
      <div className='footer'>
        <form key={2} onSubmit={handleSubmit2(sendMessage)} className='MessageForm'>
          <input
            placeholder='Ваше сообщение...'
            className='messageInput'
            autoComplete='off'
            type="text" {...register2("message",
              {
                required: "Поле не заполнено",
              })}
          />
          {errors2.message && <span>{errors2.message.message}</span>}
          <button className='chat-icon-btn'>
            <img src={img4} alt="" className='chat-icon-img' />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Main;