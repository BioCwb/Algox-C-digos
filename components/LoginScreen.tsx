
import React, { useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { createUserProfile, getUserProfile } from '../services/firestoreService';
import type { Language } from '../types';
import { GoogleIcon } from './Icon';

const LoginScreen: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState<Language>('javascript');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(userCredential.user.uid, email, preferredLanguage);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            // Check if profile exists, if not, create one
            const profile = await getUserProfile(user.uid);
            if (!profile) {
                await createUserProfile(user.uid, user.email || '', 'javascript'); // Default to JS
            }
        } catch (err: any) {
             setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-sky-50 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-sky-800">Algox Códigos</h1>
                    <p className="text-sky-600 mt-2">Sua aventura de lógica começa aqui</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        {isSignUp ? 'Criar Conta' : 'Fazer Login'}
                    </h2>

                    {error && (
                        <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleAuthAction}>
                        <div className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha (mínimo 6 caracteres)"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            {isSignUp && (
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Linguagem Preferida</label>
                                    <select
                                        id="language"
                                        value={preferredLanguage}
                                        onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="cpp">C++</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-sky-300"
                        >
                            {isLoading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
                        </button>
                    </form>
                    
                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 text-sm">OU</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    
                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200"
                    >
                        <GoogleIcon className="w-5 h-5"/>
                        Entrar com Google
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
                        <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-sky-600 hover:underline">
                            {isSignUp ? 'Faça Login' : 'Crie uma'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
