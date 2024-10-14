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

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Set dark mode on component mount
    document.documentElement.classList.add("dark");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Here you would typically call your sign-up function
    console.log("Sign-up attempt with:", { email, username, password });
    // For demo purposes, let's simulate a successful sign-up
    alert(
      "Sign-up successful! Please check your email to verify your account."
    );
  };

  return (
    <div className="h-fit  flex items-center self-center justify-center bg-zinc-900">
      <Card className="w-full max-w-md bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription className="text-zinc-400">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
              />
            </div>
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
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900 border-red-800"
              >
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
    </div>
  );
}
