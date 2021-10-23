import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type Usuario = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    usuario: Usuario | null; 
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvaider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    usuario: {
        id: string;
        avatar_url: string;
        login: string;
        name: string;
    }
}

export function AuthProvider(props: AuthProvaider) {

    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=4a8df88e3d8e2d557a1f`

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        });

        const { token, usuario } = response.data;

        localStorage.setItem('@dowhile:token', token);
        api.defaults.headers.common.authorization= `Bearer ${token}`;
        
        setUsuario(usuario);
    }

    function signOut() {
        setUsuario(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token') 

        if (token) {
            api.defaults.headers.common.authorization= `Bearer ${token}`;

            api.get<Usuario>('profile').then(res => {
                setUsuario(res.data);
            });
        }
    }, [])
    // Ao iniciar
    useEffect(() => {
        // ira pegar a url
        const url = window.location.href;
        // verifica se tem o codigo do git
        const hasGitCode = url.includes('?code=');

        // se sim,
        if (hasGitCode) {
            // separa o codigo Git da url base
            const [urlWithoutCode, gitCode] = url.split('?code=');

            // utiliza a url base obtida atravez da separação para fazer a navegação e apagar o codigo da url para o usuario
            window.history.pushState({}, '', urlWithoutCode);
            signIn(gitCode);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ signInUrl, usuario, signOut }}>
        {props.children}
        </AuthContext.Provider>
    );
}