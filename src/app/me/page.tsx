'use client';

import { useEffect, useState } from 'react';
import InfoButton from '@/components/InfoButton/InfoButton';
import '../../styles/globals.css';
import styles from './styles.module.css';
import Image from "next/image";
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function Me() {
    const [userData, setUserData] = useState({ id: '', username: '', email: '', password: '••••••••' });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [message, setMessage] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [roboMode, setRoboMode] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_URL_ROBO = process.env.NEXT_PUBLIC_API_ROBO;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/user-session/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
                const data = await res.json();
                setUserData({ id: data.id, username: data.username, email: data.email, password: '••••••••' });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchRoboMode = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL_ROBO}/get-robo-mode/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRoboMode(data.robo_mode);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
        fetchRoboMode();
    }, [API_URL, API_URL_ROBO]);

    const openRoboModal = () => {
        setTokenInput('');
        setMessage('');
        setShowModal(true);
    };

    const handleConfirmToken = async () => {
        setIsSyncing(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL_ROBO}/verify-robo-token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ token: tokenInput }),
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setRoboMode(true);
                setMessage('✅ Modo robô ativado!');
                setShowModal(false);
            } else {
                setMessage(`❌ ${data.message || 'Token inválido'}`);
            }
        } catch (err) {
            setMessage(`❌ Erro na comunicação: ${err}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleRoboButtonClick = async () => {
        if (roboMode) {
            // Desativa o modo robô
            setIsSyncing(true);
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL_ROBO}/disable-robo-mode/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setRoboMode(false);
                    setMessage('❌ Modo robô desativado');
                } else {
                    setMessage(`❌ Falha ao desativar: ${data.detail || 'Erro desconhecido'}`);
                }
            } catch (err) {
                setMessage(`❌ Erro na comunicação: ${err}`);
            } finally {
                setIsSyncing(false);
            }
        } else {
            // Ativa o modo robô via modal
            openRoboModal();
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Image src="/icons/loading.svg" alt="Loading" width={50} height={50} />
                <p>Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />

            {isSyncing && (
                <div className={styles.syncOverlay}>
                    <p>Sincronizando...</p>
                </div>
            )}

            <div className={styles.content}>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className={styles.roboButton} onClick={handleRoboButtonClick}>
                        {roboMode ? 'Desativar modo Robô' : 'Ativar modo Robô'}
                    </button>
                    {message && <p style={{ marginTop: '10px' }}>{message}</p>}
                </div>

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Digite o token, visualizado no painel do Robo</h3>
                            <input
                                type="text"
                                placeholder="Token"
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                            />
                            <button onClick={handleConfirmToken}>Confirmar</button>
                            <button onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                )}

                {/* Campos do usuário */}
                <div className={styles.dataInputContainer}>
                    <div className={styles.userContent}>
                        <p>Foto do usuário</p>
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>
                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="text" value={userData.username} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>
                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="text" value={userData.email} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>
                    <div className={styles.userContent}>
                        <input className={styles.userInput} type="password" value={userData.password} readOnly />
                        <Image src={`/icons/edit.svg`} alt="Editar" width={25} height={25} />
                    </div>
                </div>

                <div className={styles.infoButtonContainer}>
                    <InfoButton iconName="history.svg" title="Histórico" text="seus jogos anteriores" />
                    <InfoButton iconName="crown.svg" title="Ranking" text="confira o seu ranking" />
                </div>
            </div>

            <Footer iconName='person.svg' text='Meu perfil' />
        </div>
    );
}
