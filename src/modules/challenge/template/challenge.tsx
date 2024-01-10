"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ProgressBar } from "../components/ProgressBar";
import { Footer, FooterVariant } from "../components/Footer";
import { X } from "@phosphor-icons/react/dist/ssr";
import { ReadOrListen } from "../components/ReadOrListen";
import { Chat } from "../models/chat";
import { Modal } from "@/modules/share/components/Modal";
import { Button } from "@/modules/share/components/Button";

interface TemplateChallengeProps {
  sentences: Chat[];
}

export function TemplateChallenge({
  sentences: sentencesFromChat,
}: TemplateChallengeProps) {
  const [sentence, setSentence] = useState<Chat>({} as Chat);
  const [footerVariant, setFooterVariant] = useState<FooterVariant>(
    FooterVariant.NORMAL
  );
  const [selectedSentence, setSelectedSentence] = useState("");
  const [sentences, setSentences] = useState<Chat[]>(sentencesFromChat);
  const [shouldCleanValues, setShouldCleanValues] = useState(false);
  const [barPercentage, setBarPercentage] = useState(0);
  const [errorsSentences, setErrorsSentences] = useState(3);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sentence.id) {
      getRandomSentence();
    }
  }, []);

  useEffect(() => {
    createSynthesis();
  }, []);

  function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[randomIndex];
    speak(sentence.english);

    setSentence(sentence);
    const percent =
      (100 * (sentencesFromChat.length - sentences.length)) /
      sentencesFromChat.length;
    setBarPercentage(percent);

    if (footerVariant !== FooterVariant.NORMAL) {
      setFooterVariant(FooterVariant.NORMAL);
    }

    setShouldCleanValues(false);
  }

  function createSynthesis() {
    const speechSynthesis =
      window.speechSynthesis || (window as any).webKitSpeechSynthesis;

    return speechSynthesis;
  }

  function speak(text: string, rate = 1) {
    const speechSynthesis = createSynthesis();
    const speechSynthesisUtterance = new SpeechSynthesisUtterance();

    const voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Nicky");

    speechSynthesisUtterance.text = text;
    speechSynthesisUtterance.lang = "en-US";
    speechSynthesisUtterance.rate = rate;
    speechSynthesisUtterance.voice = voice ?? null;

    speechSynthesis.speak(speechSynthesisUtterance);
  }

  function handleSelectedSentence(selectedSentence: string) {
    setSelectedSentence(selectedSentence);
  }

  function checkCorrectSentence() {
    if (selectedSentence === sentence.portuguese) {
      setFooterVariant(FooterVariant.SUCCESS);
      payAudio("success");
      const newSentences = sentences.filter(
        (sentenceItem) => sentenceItem.id !== sentence.id
      );

      if (newSentences.length === 0) {
        router.push("/challenges");
      }

      setSentences(newSentences);
      setShouldCleanValues(true);

      return;
    }

    setFooterVariant(FooterVariant.ERROR);
    setShouldCleanValues(true);

    const newError = errorsSentences - 1;

    if (newError === 0) {
      payAudio("game-over");
      router.push("/challenges");
    }

    setErrorsSentences(newError);
    payAudio("error");
  }

  function payAudio(name: string) {
    new Audio(`/${name}.wav`).play();
  }

  return (
    <div className="min-h-full w-full mx-aut mt-10 h-screen">
      <div className="max-w-5xl flex md:gap-5 justify-between items-center flex-1 mx-auto w-full px-4">
        <div className="flex w-full gap-3 items-center">
          <Modal open={open} onOpenChange={setOpen}>
            <Modal.Button>
              <X size={30} />
            </Modal.Button>

            <Modal.Content>
              <div className="flex flex-col items-center w-full gap-4">
                <Image src="/bird.svg" alt="bird" height={120} width={120} />

                <span className="text-center font-bold text-xl text-gray-800">
                  Wait one minute!
                </span>

                <div className="text-center">
                  <span className="text-center text-gray-secondary font-medium">
                    You`ve already picked up the pace... if you leave now,
                    you`ll lose your progress
                  </span>
                </div>

                <Button onClick={() => setOpen(false)}>Learn more!</Button>

                <Button
                  variant="error"
                  typeButton="outline"
                  onClick={() => router.push("/challenges")}
                >
                  leave
                </Button>
              </div>
            </Modal.Content>
          </Modal>

          <ProgressBar progress={barPercentage} />

          <div className="">
            <div className="hidden md:flex md:items-center">
              <Image
                data-error={errorsSentences === 0}
                className="data-[error=true]:opacity-0 data-[error=true]:translate-y-10 duration-1000 transition-all ease-in-out"
                src="/heart.svg"
                alt="heart"
                width={32}
                height={32}
              />
              <Image
                data-error={errorsSentences <= 1}
                className="data-[error=true]:opacity-0 data-[error=true]:translate-y-10 duration-1000 transition-all ease-in-out"
                src="/heart.svg"
                alt="heart"
                width={32}
                height={32}
              />
              <Image
                data-error={errorsSentences <= 2}
                className="data-[error=true]:opacity-0 data-[error=true]:translate-y-10 duration-1000 transition-all ease-in-out"
                src="/heart.svg"
                alt="heart"
                width={32}
                height={32}
              />
            </div>

            <div className="md:hidden flex items-center gap-1">
              <Image
                data-error={errorsSentences === 0}
                src="/heart.svg"
                alt="heart"
                width={32}
                height={32}
              />
              <span className="text-red-dark">{errorsSentences}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-4 mb-14">
        <ReadOrListen
          chat={sentence}
          shouldCleanValues={shouldCleanValues}
          speak={speak}
          handleSelectedSentence={handleSelectedSentence}
        />
      </div>

      <Footer variant={footerVariant}>
        {footerVariant === FooterVariant.NORMAL && (
          <Footer.Normal handleCheck={checkCorrectSentence} />
        )}

        {footerVariant === FooterVariant.SUCCESS && (
          <Footer.Success handleClick={getRandomSentence} />
        )}

        {footerVariant === FooterVariant.ERROR && (
          <Footer.Error
            correctSolution={sentence.portuguese}
            yourSolution={selectedSentence}
            handleClick={getRandomSentence}
          />
        )}
      </Footer>
    </div>
  );
}
