import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";

export default function NoMatch() {
  return (
    <>
      <div className=" flex flex-col flex-1 w-full text-zinc-200 lg:flex-row ">
        <div className="LeftSide flex flex-col items-stretch  lg:h-full w-full items gap-6 justify-center px-2 lg:pl-10 py-4 ">
          <div className="LargeTextWrapper self-stretch flex flex-col items-stretch text-6xl 2xl:text-8xl  font-bold ">
            <div>We are in</div>
            <div>Search for your</div>
            <div>
              <Typewriter
                words={["Next", "Global", "One and Only", "Lifelong"]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </div>
            <div>Penpal</div>
          </div>
          <div className="sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl mt-4">
            <Typewriter
              words={["Stay tuned..."]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={500}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
        </div>
      </div>
    </>
  );
}
