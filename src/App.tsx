import React, { useRef, useState } from 'react';
import logoBlack from './assets/logo_black.svg';
import microphone from './assets/microphone.svg';
import styles from './App.module.scss';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import Input from './components/Input/Input';
import Button from './components/Button/Button';

export const Microphone = () => {
  const [isVoiceRecording, setIsVoiceRecord] = useState(false);
  const [callerPhone, setCallerPhone] = useState<string>('12312312312');
  const [toPhone, setToPhone] = useState('97223764206');

  const recorderRef = useRef<RecordRTC | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const startRecording = async () => {
    const newSocket = new WebSocket(
      `wss://vonage.corx.corsound.ai/microphone?from=${callerPhone}&to=${toPhone}`
    );

    newSocket.onopen = function () {
      socketRef.current = newSocket;
      console.log('connected microphone');
    };

    newSocket.onerror = function (error) {
      console.log(`[error] ${error}`);
    };

    newSocket.onclose = function (event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('[close] Connection died');
      }
    };

    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    recorderRef.current = new RecordRTC(mediaStream, {
      type: 'audio',
      mimeType: 'audio/wav',
      timeSlice: 500,
      audioBitsPerSecond: 128000,
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
      recorderType: StereoAudioRecorder,
      ondataavailable: (blob) => {
        if (newSocket.readyState === newSocket.OPEN) {
          newSocket.send(blob);
        }
      },
    });
    recorderRef.current.startRecording();

    setIsVoiceRecord(true);
  };

  const stopRecording = () => {
    if (recorderRef && recorderRef.current && socketRef.current) {
      recorderRef.current.stopRecording(() => {
        setIsVoiceRecord(false);

        (socketRef.current as WebSocket).close();
      });
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainInfo}>
        <div>
          <Input
            type="text"
            placeholder={'Enter "from" phone'}
            value={callerPhone}
            onChange={(e) => setCallerPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder={'Enter "to" phone'}
            value={toPhone}
            onChange={(e) => setToPhone(e.target.value)}
          />
          <div className={styles.buttonVoiceWrapper}>
            <Button
              isDisabled={false}
              onClick={isVoiceRecording ? stopRecording : startRecording}
              titleBtn={<img style={{ width: '20px' }} alt="microphone" src={microphone} />}
              styled={isVoiceRecording ? styles.animated : ''}
            />
          </div>
        </div>
      </div>
      <img className={styles.logo} src={logoBlack} alt="logo" />
    </div>
  );
};
