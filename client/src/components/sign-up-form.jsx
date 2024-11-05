import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSharedState } from "../MyContext";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState("");
  const [isConsentChecked, setIsConsentChecked] = useState("");
  const [invalidPasswordMessages, setInvalidPasswordMessages] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Set dark mode on component mount
  //   document.documentElement.classList.add("dark");
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isPasswordValid) {
      setError();
      alert(
        "Password requirements are not met. Please enter passwords again to meet requirements."
      );
      return;
    }

    if (!isConsentChecked) {
      alert("Please consent to the agreeemnt to sign up.");
      return;
    }

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error);
          return;
        }
        return response.json();
      })
      .then((responsePayload) => {
        localStorage.setItem("token", responsePayload.token);
        setIsLoggedIn(true);
        alert("Sign up success!");
        navigate("/");
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });

    // Here you would typically call your sign-up function
    console.log("Sign-up attempt with:", { email, username, password });
    // For demo purposes, let's simulate a successful sign-up
  };

  return (
    <Card className="w-full self-center max-w-md bg-zinc-800 text-zinc-100 my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription className="text-zinc-400">
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-100">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-100">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2 pb-4">
            <Label htmlFor="confirmPassword" className="text-zinc-100">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>

          {password ? (
            <PasswordChecklist
              className="flex flex-col text-sm my-0 space-y-0"
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={5}
              value={password}
              valueAgain={passwordAgain}
              onChange={(isValid, failedRules) => {
                setIsPasswordValid(isValid);
                setInvalidPasswordMessages(failedRules);
              }}
              invalidTextColor="red"
              hideIcon={true}
            />
          ) : (
            <></>
          )}

          <div className=" p-1 text-sm  flex flex-col gap-2 overflow-y-scroll overscroll-x-none border-zinc-500 border h-48 ">
            <span className="text-lg font-bold self-center"> User Privacy Agreement</span>
            <span className=" self-center">Last Updated: Nov 4, 2024</span>
            <span>
              Welcome to Lifelong! We are committed to protecting your privacy and ensuring your trust. This Privacy Agreement explains how we collect, use, and protect your information to help you connect with suitable penpals.
            </span>
            <span>

              <span className="text-lg font-bold self-center"> Information</span><br />

              We Collect
              To provide our services, we collect and use certain types of information from our users. This includes:
            </span>

            <span>
              Personal Information: Such as email address, age, country, language preferences, interests, and any other information you provide that can help us match you with compatible penpals.
              User ID: A unique identifier assigned to you, which allows us to securely manage and protect your data.
              How We Use Your Information
              Our goal is to provide a safe, personalized, and enjoyable penpal experience. To do this, we use the information collected in the following ways:
            </span>

            <span>
              Matching Mechanism: We use advanced Large Language Models (LLMs) to find compatible penpals based on your preferences and profile data. Please note that we do not include your name in any requests sent to our matching service providers, such as ChatGPT or Gemini; only your user ID is included in these interactions.
              Third-Party Data Sharing
              We prioritize data privacy and do not sell, lease, or otherwise distribute your information to unauthorized third parties. Information sent to our matching service providers, ChatGPT or Gemini, includes only non-identifiable user IDs to protect your privacy.
            </span>

            <span>
              <span className=" font-bold">Data Security<br /> </span>
              We take appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. All data transmission is encrypted, and access to your personal information is restricted to authorized personnel only.
            </span>

            <span>

              <span className=" font-bold">Your Rights and Choices<br /> </span>
              You have the right to:
            </span>

            <span>
              Access and update your personal information within the app.
              Delete your account and associated data.
              Withdraw your consent to data processing.
              To exercise these rights, please contact our support team at support@lifelong.com
            </span>

            <span>
              Changes to This Privacy Agreement:
              We may update this Privacy Agreement periodically to reflect changes in our practices. We will notify you of any significant changes by posting the new Privacy Agreement in the app.
            </span>

            <span>
              <span className=" font-bold">Contact Us<br /> </span>

              If you have any questions or concerns about this Privacy Agreement, please reach out to us via the email above.
            </span>

          </div>
          <div className="flex flex-row  items-center justify-center">
            <label htmlFor="consent" className="italic text-sm">
              I consent:
            </label>{" "}
            <input
              type="checkbox"
              className="ml-2"
              id="consent"
              name="consent"
              checked={isConsentChecked}
              onChange={(e) => setIsConsentChecked(e.target.checked)}
            ></input>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          to="/"
          className=" text-zinc-400 hover:text-zinc-100 hover:underline text-sm font-bold transition  ease-in-out"
        >
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
