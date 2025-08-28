'use client';

import { useEffect, useState } from 'react';
import InfoButton from '@/components/InfoButton/InfoButton';
import '../../styles/globals.css';
import styles from './styles.module.css';
import Image from "next/image";
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function Me() {
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        email: '',
        password: '••••••••',
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [tokenSent, setTokenSent] = useState(false);
    const [message, setMessage] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [roboMode, setRoboMode] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_URL_ROBO = process.env.NEXT_PUBLIC_API_ROBO;

    async function toggleRoboMode(ativo: boolean) {
        setIsSyncing(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/set-robo-mode/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ativo }),
            });
            if (res.ok) {
                setRoboMode(ativo);
            } else {
                alert('Erro ao alterar modo robô');
            }
        } catch (e) {
            alert(`Erro na comunicação: ${e}`);
        } finally {
            setIsSyncing(false);
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/user-session/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Erro ao buscar dados do usuário');

                const data = await res.json();

                setUserData({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    password: '••••••••',
                });

                setLoading(false);
            } catch (error) {
                console.error('❌ Erro ao carregar dados do usuário:', error);
            }
        };

        const fetchRoboMode = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL_ROBO}/get-robo-mode/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRoboMode(data.robo_mode);
                }
            } catch (err) {
                console.error('Erro ao verificar modo robô:', err);
            }
        };

        fetchUserData();
        fetchRoboMode();
    }, [API_URL]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Image src="/icons/loading.svg" alt="Loading" width={50} height={50} className={styles.spinner} />
                <p>Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.dataInputContainer}>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem('token');

                                if (roboMode) {
                                    // Desativa diretamente
                                    toggleRoboMode(false);
                                } else {
                                    // Ativa via envio de token por e-mail
                                    setIsSyncing(true);
                                    try {
                                        const res = await fetch(`${API_URL_ROBO}/generate-robo-token/`, {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ user_id: userData.id }),
                                        });
                                        if (res.ok) {
                                            const data = await res.json();

                                            if (data.message?.includes("já utilizado")) {
                                                setMessage("✅ Modo robô já estava ativo nos últimos 7 dias!");
                                                setRoboMode(true);
                                                setShowModal(false);
                                            } else {
                                                setTokenSent(true);
                                                setShowModal(true);
                                            }
                                        } else {
                                            const err = await res.json();
                                            alert(`Erro ao gerar token: ${err.detail || 'Erro desconhecido'}`);
                                        }
                                    } catch (e) {
                                        alert(`Erro na comunicação: ${e}`);
                                    } finally {
                                        setIsSyncing(false);
                                    }
                                }
                            }}
                            className={styles.roboButton}
                        >
                            {roboMode ? 'Desativar modo Robô' : 'Ativar modo Robô'}
                        </button>
                    </div>

                    {isSyncing && (
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            color: '#fff',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            Sincronizando...
                        </div>
                    )}

                    {showModal && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modal}>
                                <h3>Digite o token enviado para seu e-mail</h3>
                                <input
                                    type="text"
                                    placeholder="Token"
                                    value={tokenInput}
                                    onChange={(e) => setTokenInput(e.target.value)}
                                />
                                <button
                                    onClick={async () => {
                                        const token = localStorage.getItem('token');
                                        setIsSyncing(true);
                                        const res = await fetch(`${API_URL_ROBO}/validate-robo-token/`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ token: tokenInput })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setMessage('✅ Modo robô ativado!');
                                            setRoboMode(true);
                                            setShowModal(false);
                                        } else {
                                            setMessage(`❌ ${data.detail || 'Token inválido'}`);
                                        }
                                        setIsSyncing(false);
                                    }}
                                >
                                    Confirmar
                                </button>
                                <button onClick={() => setShowModal(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                    {message && <p style={{ textAlign: 'center' }}>{message}</p>}

                    <div className={styles.userContent}>
                        <p>Foto do usuário</p>
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>

                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="text" name="username" value={userData.username} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>

                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="text" name="email" value={userData.email} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>

                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="password" name="password" value={userData.password} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>
                </div>

                <div className={styles.infoButtonContainer}>
                    <InfoButton iconName="history.svg" title="Histórico" text="seus jogos anteriores" />
                    <InfoButton iconName="crown.svg" title="Ranking" text="confira o seu ranking" />
                </div>

                <button className={styles.deleteAccountButton}>
                    <Image src={'/icons/delete.svg'} alt="trash can" width={50} height={50} />
                    <p>APAGAR CONTA</p>
                </button>
            </div>

            <Footer iconName='person.svg' text='Meu perfil' />
        </div>
    );
}
