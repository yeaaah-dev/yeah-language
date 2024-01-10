"use client";

import { ProgressBar } from "../components/ProgressBar";
import { Footer, FooterVariant } from "../components/Footer";
import { X } from "@phosphor-icons/react/dist/ssr";
import { ReadOrListen } from "../components/ReadOrListen";
import { Chat } from "../models/chat";
import { useEffect, useState } from "react";

interface TemplateChallengeProps {
  sentences: Chat[];
}

export function TemplateChallenge({ sentences }: TemplateChallengeProps) {
  const [sentence, setSentence] = useState<Chat>({} as Chat);

  useEffect(() => {
    const choiceSentences =
      sentences[Math.floor(Math.random() * sentences?.length)];
    setSentence(choiceSentences);
  }, [sentences]);

  return (
    <div className="min-h-full w-full mx-aut mt-10 h-screen">
      <div className="max-w-5xl flex md:gap-5 justify-between items-center flex-1 mx-auto w-full px-4">
        <div className="flex w-full gap-3 items-center">
          <X size={30} />

          <ProgressBar progress={80} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-4 mb-14">
        <ReadOrListen chat={sentence} />
      </div>

      <Footer variant={FooterVariant.ERROR}>
        {/* <Footer.Normal /> */}

        {/* <Footer.Success /> */}

        <Footer.Error />
      </Footer>
    </div>
  );
}
