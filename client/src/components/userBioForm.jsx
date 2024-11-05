import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RadioGroupInput from "./radio-group-input";
import TextInput from "./text-input";
import TextareaInput from "./textarea-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SelectInput from "./select-input";
import { countries } from "../countries.js";
import { useNavigate } from "react-router-dom";

export default function UserBioForm() {
  const [isBioComplete, setIsBioComplete] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bioResponse = await fetch("http://localhost:3000/bio", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        const bioData = await bioResponse.json();
        setAge(bioData.age || "");
        setOccupation(bioData.occupation || "");
        setGender(bioData.gender || "");
        setEthnicity(bioData.ethnicity || "");
        setCountry(bioData.country || "");
        setHomeCountry(bioData.homeCountry || "");
        setMaritalStatus(bioData.maritalStatus || "");
        setExchangeType(bioData.exchangeType || "");
        setMessageFrequency(bioData.messageFrequency || "");
        setBio(bioData.bio || "");
        console.log(bioData);

        const metaDataResponse = await fetch(
          "http://localhost:3000/user-metadata",
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        const metaData = await metaDataResponse.json();
        setIsBioComplete(metaData.bioComplete);
        console.log(metaData);
      } catch (error) {
        setError("Error fetching data");
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
    const bioData = {
      age,
      occupation,
      gender,
      ethnicity,
      country,
      homeCountry,
      maritalStatus,
      exchangeType,
      messageFrequency,
      bio,
    };

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

    if (isBioComplete) {
      console.log("Patch started");
      fetch("http://localhost:3000/bio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(bioData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        })
        .then(() => {
          alert("Updated successfully!");
          setIsBioComplete(true);
          navigate("/");
        })
        .catch((error) => {
          setError("Error updating bio");
          console.log(error);
        });
    } else {
      console.log("starting post");
      fetch("http://localhost:3000/bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(bioData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        })
        .then(() => {
          alert("Filled out successfully!");
          setIsBioComplete(true);
          navigate("/");
        })
        .catch((error) => {
          setError("Error submitting bio");
          console.log(error);
        });
    }
  };

  return (
    <div className=" flex flex-rows  items-center justify-center bg-zinc-950 p-4 xl:p-10 md:w-4/5 ">
      <Card className="w-full  bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl md:text-4xl font-bold">
            Your Bio
          </CardTitle>
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
              <Alert variant="destructive">
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
