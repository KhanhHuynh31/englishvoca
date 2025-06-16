import React from "react";

interface ListeningProps {
  word: string;
}

export default function Listening({ word }: ListeningProps) {
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak(word);
      }}
      className="text-xl hover:scale-125 transition-transform duration-200"
      title="Nghe phát âm"
    >
      🔊
    </button>
  );
}
