import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useSharedState } from "../MyContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginForm() {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }


    // Here you would typically call your authentication function
    console.log("Login attempt with:", { username, password });

    var responseStatus;
    fetch("http://localhost:3000/login", {
      method: "post",
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        "Content-Type": "application/json",

      }, // Content-Type is in quotes because it has a '-'
    })
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((responsePayload) => {
        if (responseStatus === 200) {
          // Store the token in a cookie/local storage
          localStorage.setItem("token", responsePayload.token);
          setIsLoggedIn(true);
          // alert("Login success!");
          navigate("/");
        } else {
          alert(responsePayload);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl xl:text-4xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="flex w-fit">
            Log in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
