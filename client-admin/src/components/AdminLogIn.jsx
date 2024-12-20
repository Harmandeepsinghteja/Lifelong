import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AdminLogIn() {
  const [adminUsername, setAdminUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!adminUsername || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Here you would typically call your authentication function
    console.log("Login attempt with:", { adminUsername, password });

    var responseStatus;
    fetch(`${import.meta.env.VITE_SERVER_IP_AND_PORT}/admin-login`, {
      method: "post",
      body: JSON.stringify({
        username: adminUsername,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((data) => {
        if (responseStatus === 200) {
          localStorage.setItem("admin_token", data.admin_token);
          setIsLoggedIn(true);
        } else {
          alert(data);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20  text-zinc-200 bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-xl xl:text-4xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminUsername">Username</Label>
            <Input
              id="adminUsername"
              type="text"
              placeholder="Enter Admin username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
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
