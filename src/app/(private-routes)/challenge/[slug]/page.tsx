"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import units from "@/data/units.json";
import { TemplateChallenge } from "@/modules/challenge/template/challenge";
import { generateSlug } from "@/tools/generateSlug";
import { Chat } from "@/modules/challenge/models/chat";
import { Loading } from "@/modules/share/components/Loading";

export default function Challenge() {
  const [sentences, setSentences] = useState<Chat[]>([]);
  const fistRender = useRef(true);
  const params = useParams();
  const { slug } = params;

  const unit = units.content.find((unit) => generateSlug(unit.title) === slug);

  useEffect(() => {
    if (!sentences.length && fistRender.current) {
      fistRender.current = false;

      fetch("http://localhost:3000/api/generate-sentences", {
        method: "POST",
        body: JSON.stringify({ unit: unit?.contents }),
      })
        .then((res) => res.json())
        .then((response) => {
          setSentences(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      {sentences.length > 0 ? (
        <TemplateChallenge sentences={sentences} />
      ) : (
        <div className="h-screen flex w-full m-auto max-w-[162px] items-center justify-center">
          <div className="text-center">
            <Loading />

            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-600">Loading...</h1>
              <span className="mr-5">Wait a munute</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
