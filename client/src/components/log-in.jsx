import LoginForm from "@/components/login-form";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";

export default function LogIn() {
  return (
    <>
      <div className=" flex flex-col flex-1 w-full text-zinc-200 lg:flex-row ">
        <div className="LeftSide flex flex-col items-stretch  lg:h-full w-full items gap-6 justify-center px-2 lg:pl-10 py-4 ">
          <div className="LargeTextWrapper self-stretch flex flex-col items-stretch text-6xl 2xl:text-8xl  font-bold ">
            <div>Find your</div>
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
            Lifelong is AI-based penpal match finder that finds the most
            compatible penpal through reinforced learning. Sign up to find your
            true lifelong penpal that you can share deep connection with.
          </div>
          <div className="text-md mt-4">
            We do not share any personal information with AI. See About page for
            more information.
          </div>
        </div>
        <div className="RightSide flex flex-col justify-center items-center w-full mt-4 p-4">
          <LoginForm />

          <Link to="/signup" className="mt-4 text-sm">
            Sign Up Here
          </Link>
        </div>
      </div>
    </>
  );
}
