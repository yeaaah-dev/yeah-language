import { ProgressBar } from "../components/ProgressBar";
import { Footer, FooterVariant } from "../components/Footer";
import { X } from "@phosphor-icons/react/dist/ssr";

export function TemplateChallenge() {
  return (
    <div className="min-h-full w-full mx-aut mt-10 h-screen">
      <div className="max-w-5xl flex md:gap-5 justify-between items-center flex-1 mx-auto w-full px-4">
        <div className="flex w-full gap-3 items-center">
          <X size={30} />

          <ProgressBar progress={80} />
        </div>
      </div>

      <Footer variant={FooterVariant.ERROR}>
        {/* <Footer.Normal /> */}

        {/* <Footer.Success /> */}

        <Footer.Error />
      </Footer>
    </div>
  );
}
