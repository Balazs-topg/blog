"use client";
import React, { useRef, useState } from "react";
import { Checkbox, NextUIProvider } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import Nav from "../components/Nav";

function Page() {
  const usernameSignupRef = useRef();
  const emailSignupRef = useRef();
  const passwordSignupRef = useRef();
  const [consent, setConsent] = useState(false);

  const handleSignup = async () => {
    const username = usernameSignupRef.current.value;
    const email = emailSignupRef.current.value;
    const password = passwordSignupRef.current.value;

    console.log(username);
    console.log(email);
    console.log(password);
    console.log(consent);

    if (!username || !email || !password || !consent) {
      console.error("All fields are required");
      return;
    }

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, consent }),
      });

      const data = await response.json();
      console.log("Signup successful", data);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col dark mx-auto max-w-lg py-8">
        <div className="bg-zinc-700 border border-zinc-600 p-4 rounded-2xl">
          <Tabs color="primary" fullWidth size="md" aria-label="Tabs form">
            <Tab key="LogIn" title="Log in">
              <Card>
                <CardBody className="bg-zinc-800 space-y-6">
                  <Input type="email" label="Email" variant="faded" />
                  <Input type="password" label="Password" variant="faded" />
                  <Button variant="shadow" color="secondary">
                    Log in
                  </Button>
                  <Button variant="ghost" color="secondary">
                    Log in as guest
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="SignUp" title="Sign up">
              <Card>
                <CardBody className="bg-zinc-800 space-y-6">
                  <Input
                    ref={usernameSignupRef}
                    type="name"
                    label="Username"
                    variant="faded"
                  />
                  <Input
                    ref={emailSignupRef}
                    type="email"
                    label="Email"
                    variant="faded"
                  />
                  <Input
                    ref={passwordSignupRef}
                    type="password"
                    label="Password"
                    variant="faded"
                  />
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  >
                    I consent to my info being stored
                  </Checkbox>
                  <Button
                    variant="shadow"
                    color="secondary"
                    onClick={handleSignup}
                    isRequired
                  >
                    Sign up
                  </Button>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
