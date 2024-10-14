import SignUpForm from "@/components/sign-up-form";
const SignUp = () => {
  return (
    <div className="SignUpFormWrapper flex flex-col flex-1 md:flex-row bg-zinc-950 h-auto w-full justify-center">
      <SignUpForm></SignUpForm>
    </div>
  );
};

export default SignUp;
