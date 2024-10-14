import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function UserBioForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !name ||
      !age ||
      !occupation ||
      !gender ||
      !relationshipStatus ||
      !bio
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Here you would typically call your submit function
    console.log("Bio submitted:", {
      name,
      age,
      occupation,
      gender,
      relationshipStatus,
      bio,
      hobbies,
    });
    // For demo purposes, let's simulate a successful submission
    alert("Bio submitted successfully!");
  };

  return (
    <div className="flex flex-rows items-center justify-center bg-zinc-950 p-4 xl:p-10 md:w-4/5 ">
      <Card className="w-full  bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Bio</CardTitle>
          <CardDescription className="text-zinc-400">
            Tell us about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-100">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-zinc-100">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-zinc-100">
                Occupation
              </Label>
              <Input
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-100">Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                required
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="male" className="text-zinc-100">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="female" className="text-zinc-100">
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="other"
                    id="other"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="other" className="text-zinc-100">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-100">Relationship Status</Label>
              <RadioGroup
                value={relationshipStatus}
                onValueChange={setRelationshipStatus}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="single"
                    id="single"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="single" className="text-zinc-100">
                    Single
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="in-relationship"
                    id="in-relationship"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="in-relationship" className="text-zinc-100">
                    In a Relationship
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="married"
                    id="married"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="married" className="text-zinc-100">
                    Married
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="complicated"
                    id="complicated"
                    className="border-zinc-500"
                  />
                  <Label htmlFor="complicated" className="text-zinc-100">
                    It's Complicated
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-zinc-100">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500 min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-zinc-100">
                Hobbies (optional)
              </Label>
              <Textarea
                id="hobbies"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
                placeholder="What do you like to do in your free time?"
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
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
