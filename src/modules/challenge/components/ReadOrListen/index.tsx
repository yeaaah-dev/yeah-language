"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SpeakerSimpleHigh } from "@phosphor-icons/react/dist/ssr";

import { Tag } from "../Tag";
import { Chat } from "../../models/chat";

const words = [
  "apple",
  "banana",
  "car",
  "dog",
  "elephant",
  "flower",
  "guitar",
  "house",
  "island",
  "jungle",
  "kangaroo",
];

interface ReadOrListenProps {
  chat: Chat;
}

interface RandomWords {
  id: string;
  word: string;
}

interface Sentence extends Chat {
  randomWords: RandomWords[];
}

interface AddStartProps {
  wordRefPosition: DOMRect;
  containerRefPosition: DOMRect;
  wordRef: HTMLDivElement;
  word: string;
}

interface AddEndProps {
  wordRefPosition: DOMRect;
  wordRef: HTMLDivElement;
  word: string;
  lastWordSelected: HTMLDivElement;
}

export function ReadOrListen({ chat }: ReadOrListenProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sentence, setSentence] = useState<Sentence>({} as Sentence);
  const containerRef = useRef<HTMLHRElement | null>(null);
  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordsSelectedRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!chat.id) return;
    const randomWords = generateRandomWords(
      chat?.portuguese + " " + chat?.randomPortuguese
    );

    // Ele trabalha aos sábados?Ela não viaja com frequência.

    const sentenceGenerated = {
      ...chat,
      randomWords,
    };

    setSentence(sentenceGenerated);
  }, [chat]);

  function generateRandomWords(sentenceValue: string): RandomWords[] {
    if (!sentenceValue) return [];

    const words = sentenceValue
      .split(" ")
      .sort(() => Math.random() - 0.5)
      .map((word) => {
        return {
          id: crypto.randomUUID(),
          word,
        };
      });

    return words;
  }

  function updateSelectedWord(word: string, wordRef: HTMLDivElement) {
    setTimeout(() => {
      setSelectedWords([...selectedWords, word]);
      wordRef.style.display = "none";
    }, 300);
  }

  function addStart({
    containerRefPosition,
    wordRefPosition,
    wordRef,
    word,
  }: AddStartProps) {
    const y =
      wordRefPosition.y - containerRefPosition.y + wordRefPosition.height + 6;

    const x = wordRefPosition.x - containerRefPosition.x;

    wordRef.style.transform = `translate(-${x}px, -${y}px)`;
    updateSelectedWord(word, wordRef);
  }

  function addEnd({
    word,
    wordRef,
    wordRefPosition,
    lastWordSelected,
  }: AddEndProps) {
    const lastWordSelectedPosition = lastWordSelected.getBoundingClientRect();

    const x =
      wordRefPosition.x -
      lastWordSelectedPosition.x -
      (lastWordSelectedPosition.width + 8);

    const y = wordRefPosition.y - lastWordSelectedPosition.y;

    let translate = `translate(-${x}px, -${y}px)`;

    if (x < 0) {
      translate = `translate(${-1 * x}px, ${-1 * y}px)`;
    }

    wordRef.style.transform = translate;
    updateSelectedWord(word, wordRef);
  }

  function handleSelectedWord(word: string, index: number) {
    if (!containerRef.current) return;
    if (!wordsRef.current) return;

    const containerRefPosition = containerRef.current.getBoundingClientRect();

    const wordRef = wordsRef.current[index];

    if (!wordRef) return;

    const wordRefPosition = wordRef.getBoundingClientRect();

    if (selectedWords.length === 0) {
      addStart({ containerRefPosition, wordRefPosition, wordRef, word });
      return;
    }

    const lastWordSelected =
      wordsSelectedRef.current[wordsSelectedRef.current.length - 1];

    if (!lastWordSelected) return;

    addEnd({
      wordRefPosition,
      wordRef,
      word,
      lastWordSelected,
    });
  }

  function verifyWordSelected(word: string): boolean {
    return selectedWords.includes(word);
  }

  function removeWordSelected(word: string) {
    const selectedWordsFiltered = selectedWords.filter((item) => item !== word);

    setSelectedWords(selectedWordsFiltered);
  }

  return (
    <div className="min-h-full h-full w-full flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-[#3c3c3c]">
          Write this in English
        </h1>

        <div className="flex items-center gap-2">
          <Image src="/ana.png" alt="Ana piture" height={169} width={114} />
          <div className="flex items-center gap-2 border-2 border-gray-300 py-[14px] px-[26px] rounded-2xl">
            <SpeakerSimpleHigh
              size={32}
              className="text-blue-primary focus:text-gray-600"
              weight="fill"
            />
            <span>{sentence.english}</span>
          </div>
        </div>
        <hr className="border-2" />

        <div className="mt-1 flex flex-wrap gap-2 min-h-12">
          {selectedWords.map((word) => (
            <div
              key={word}
              ref={(element) => {
                if (!element || wordsSelectedRef.current.includes(element))
                  return;

                wordsSelectedRef.current.push(element);
              }}
            >
              <Tag handleClick={() => removeWordSelected(word)}>{word}</Tag>
            </div>
          ))}
        </div>

        <hr className="border-2 mt-1" ref={containerRef} />

        <div className="flex flex-wrap gap-2 mt-7 ">
          {sentence.randomWords &&
            sentence?.randomWords?.map((randomWord, index) => (
              <div key={randomWord.id}>
                <div
                  ref={(element) => {
                    if (!element || wordsRef.current.includes(element)) return;

                    wordsRef.current.push(element);
                  }}
                  className="transition-all duration-300"
                >
                  <Tag
                    selected={verifyWordSelected(randomWord.word)}
                    handleClick={() =>
                      handleSelectedWord(randomWord.word, index)
                    }
                  >
                    {randomWord.word}
                  </Tag>
                </div>

                <div
                  data-disabled={verifyWordSelected(randomWord.word)}
                  className="data-[disabled=true]:block data-[disabled=false]:hidden"
                >
                  <Tag
                    selected={true}
                    handleClick={() =>
                      handleSelectedWord(randomWord.word, index)
                    }
                  >
                    {randomWord.word}
                  </Tag>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
