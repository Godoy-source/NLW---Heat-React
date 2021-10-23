import styles from './styles.module.scss';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { useContext, useState, FormEvent } from 'react';
import { AuthContext } from '../../contexs/auth';
import { api } from '../../services/api';
export function SendMessageForm() {
    const { usuario, signOut } = useContext(AuthContext);
    const [mensagem, setMessage] = useState('');

    async function handleSendMessage(event: FormEvent ) {
        console.log(mensagem)
        event.preventDefault();

        // trim é retirando os espaços
        if (!mensagem.trim()) {
            return;
        }
        await api.post('/messages', {mensagem});

        setMessage('');
    }   

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32"></VscSignOut>
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={usuario?.avatar_url} alt={usuario?.name}></img>
                </div>

                <strong className={styles.userName}>{usuario?.name}</strong>
                <span className={styles.userGithub}><VscGithubInverted size="16"/>{usuario?.login}</span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea 
                name="message" 
                id="message" 
                placeholder="Qual sua expectativa para o NLW Heat?" 
                onChange={event => setMessage(event.target.value)}
                value={mensagem}    
                >
                </textarea>
                <button type="submit">Enviar mensagem</button>
            </form>
        </div>
    );
}