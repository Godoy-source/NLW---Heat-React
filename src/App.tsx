import { useContext } from "react";
import styles from "./App.module.scss";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexs/auth";

export function App() {
  const { usuario } = useContext(AuthContext);

  return (
    <main className={`${styles.contentWrapper} ${!!usuario ? styles.contentSigned : ''} `}>
      <MessageList></MessageList>
      { !!usuario ? <SendMessageForm></SendMessageForm> : <LoginBox></LoginBox> }
    </main>
  );
}
