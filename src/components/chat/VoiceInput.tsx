"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  lang?: string; // 'en-IN', 'hi-IN', 'te-IN'
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function VoiceInput({ onTranscript, lang = "en-IN" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript, lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={isListening ? "Stop voice listening" : "Start voice input"}
      title={isListening ? "Listening... click to stop" : "Speak your message"}
      className={cn(
        "p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
        isListening
          ? "bg-red-500 text-white animate-pulse shadow-md"
          : "text-gray-400 hover:text-[#C2185B] hover:bg-[#F3EEFF] dark:hover:bg-[#2B1F44]"
      )}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
