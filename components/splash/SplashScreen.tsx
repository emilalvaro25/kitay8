/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import KithaiLogo from '../AionLogo';
import './SplashScreen.css';

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const INTRO_AUDIO_URL = "https://csewoobligshhknqmvgc.supabase.co/storage/v1/object/public/storagekhitai/intro.mp3";

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt to play the audio, handling potential browser restrictions
    const playAudio = async () => {
      if (audioRef.current) {
        // Start muted, as browsers are more likely to allow this for autoplay.
        audioRef.current.muted = true;
        try {
          await audioRef.current.play();
          // If muted playback succeeds, attempt to unmute.
          // This is a best-effort approach. If it fails, audio will remain silent,
          // but it prevents the console error that the user was seeing.
          audioRef.current.muted = false;
        } catch (error) {
          // Log a less severe warning, as this is an expected browser behavior.
          console.warn("Audio autoplay was blocked by the browser:", error);
        }
      }
    };
    playAudio();
  }, []);

  return (
    <div className="splash-screen" onAnimationEnd={onAnimationEnd}>
      <KithaiLogo className="splash-logo" />
      <audio ref={audioRef} src={INTRO_AUDIO_URL} preload="auto" />
    </div>
  );
};

export default SplashScreen;