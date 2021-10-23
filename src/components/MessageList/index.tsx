import styles from "./styles.module.scss";
import logo from "../../assets/logo.svg";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type Message = {
  id: string;
  text: string;
  created_at?: string;
  usuario: {
    name: string;
    avatar_url: string;
  };
};

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('nova_mensagem', newMessage => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => 
          [
            messagesQueue[0],
            prevState[0],
            prevState[1]
          ].filter(Boolean));
      }
      messagesQueue.shift();
    }, 3000)
  }, [])

  // Quando a variavel mudar de valor irá executar
  useEffect(() => {
    api.get<Message[]>("/messages/last3").then((res) => {
      setMessages(res.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logo} alt="DoWhile 2021"></img>
      <ul className={styles.messageList}>
        {messages.map((message) => {
          return (
            <li key={message.created_at} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img
                    src={message.usuario.avatar_url}
                    alt={message.usuario.name}
                  />
                </div>
                <span>{message.usuario.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
