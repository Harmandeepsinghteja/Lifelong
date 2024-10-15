import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RadioGroupInput from "./radio-group-input";
import TextInput from "./text-input";
import TextareaInput from "./textarea-input";
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
import SelectInput from "./select-input";
import { countries } from "../countries.js";

export default function UserBioForm() {
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [country, setCountry] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [exchangeType, setExchangeType] = useState("");
  const [messageFrequency, setMessageFrequency] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !gender ||
      !ethnicity ||
      !country ||
      !homeCountry ||
      !maritalStatus ||
      !exchangeType ||
      !messageFrequency
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    console.log("Bio submitted:", {
      age,
      occupation,
      gender,
      ethnicity,
      currentCity: country,
      hometown: homeCountry,
      maritalStatus,
      exchangeType,
      messageFrequency,
      bio,
    });
    alert("Submitted successfully!");
  };

  return (
    <div className=" flex flex-rows  items-center justify-center bg-zinc-950 p-4 xl:p-10 md:w-4/5 ">
      <Card className="w-full  bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Bio</CardTitle>
          <CardDescription className="text-zinc-400">
            Tell us about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col gap-3"
          >
            <TextInput
              id="age"
              label="How old are you?"
              value={age}
              onChange={setAge}
              required
              type="number"
            />
            <TextInput
              id="occupation"
              label="What do you do for living?"
              value={occupation}
              onChange={setOccupation}
              required
            />
            <RadioGroupInput
              label="What is your gender?"
              options={["Man", "Woman", "Nonbinary", "Prefer not to say"]}
              value={gender}
              onChange={setGender}
              required
            />

            <RadioGroupInput
              label="What is your ethnicity?"
              options={[
                "African",
                "Asian",
                "European",
                "Indigenous Peoples",
                "Latino/Hispanic",
                "Prefer not to say",
              ]}
              value={ethnicity}
              onChange={setEthnicity}
              required
            />

            <SelectInput
              id="Country"
              label="Where do you live now?"
              options={countries}
              value={country}
              onChange={setCountry}
              required
            />

            <SelectInput
              id="homeCountry"
              label="Where was your home country?"
              options={countries}
              value={homeCountry}
              onChange={setHomeCountry}
              required
            />

            <RadioGroupInput
              label="Marital status:"
              options={["Single", "Married", "Separated", "Prefer not to say"]}
              value={maritalStatus}
              onChange={setMaritalStatus}
              required
            />

            <RadioGroupInput
              label="What kind of exchange are you looking for:"
              options={["Casual Chat", "Letter"]}
              value={exchangeType}
              onChange={setExchangeType}
              required
            />

            <RadioGroupInput
              label="How often do you want to message:"
              options={["Daily", "Weekly", "Monthly"]}
              value={messageFrequency}
              onChange={setMessageFrequency}
              required
            />

            <TextareaInput
              id="bio"
              label="Tell us anything about yourself, that you want to share with your penpal."
              helperText="Here are some ideas: Any favorite foods, movies, shows, books, or sports?  What are your hobbies?  Do you have any life goals?  Do you have any pets?"
              value={bio}
              onChange={setBio}
              required
              placeholder="Share your interests, hobbies, or anything you'd like your penpal to know..."
            />

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
