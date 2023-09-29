"use client";
import React, { useRef, useState } from "react";
import {
  Checkbox,
  NextUIProvider,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";
import Nav from "../../components/Nav";
import { useRouter } from "next/navigation";
import isBrowser from "../../utils/isBrowser";

function SignUpForm() {
  const router = useRouter();

  const usernameSignupRef = useRef();
  const emailSignupRef = useRef();
  const passwordSignupRef = useRef();
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameIsTaken, setUsernameIsTaken] = useState(false);
  const [emailIsTaken, setEmailIsTaken] = useState(false);
  const [passwordIsWeak, setPasswordIsWeak] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("yoo handleSignup is called");
    setIsSubmitting(true);

    const signUpBody = {
      username: usernameSignupRef.current.value,
      email: emailSignupRef.current.value,
      password: passwordSignupRef.current.value,
    };
    console.log(signUpBody);

    //call backend API
    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpBody),
      });
      const data = await response.json();
      console.log("api responded with: ", data);

      // Store the JWT in local storage
      if (isBrowser) {
        if (data.SignupSuccessfull) {
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: signUpBody.username,
              email: signUpBody.email,
            })
          );
        }
      }

      setUsernameIsTaken(data.usernameIsTaken);
      setEmailIsTaken(data.emailIsTaken);
      setPasswordIsWeak(data.passwordIsWeak);
      setIsSubmitting(false);
      data.SignupSuccessfull && router.push("/authenticate/sign-up-success");
    } catch (error) {
      setServerError(true);
      setIsSubmitting(false);
      console.error("api failed: ", error);
    }
  };

  return (
    <Card>
      <CardBody className="bg-zinc-800">
        <form className="space-y-6 flex flex-col" onSubmit={handleSignup}>
          <Input
            isRequired
            ref={usernameSignupRef}
            type="name"
            label="Username"
            variant="faded"
            autocomplete="on"
            isInvalid={usernameIsTaken}
            errorMessage={
              usernameIsTaken
                ? "that username is alredy in use, please choose a different one"
                : ""
            }
          />
          <Input
            isRequired
            ref={emailSignupRef}
            type="email"
            label="Email"
            variant="faded"
            autocomplete="on"
            isInvalid={emailIsTaken}
            errorMessage={
              emailIsTaken
                ? "that email is alredy in use, please choose a different one"
                : ""
            }
          />
          <Input
            isRequired
            ref={passwordSignupRef}
            type="password"
            autocomplete="new-password"
            label="Password"
            variant="faded"
            isInvalid={passwordIsWeak}
            errorMessage={
              passwordIsWeak
                ? "please choose a password with 5 or more characters"
                : ""
            }
          />
          <Checkbox
            isRequired
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          >
            I consent to my info being stored
          </Checkbox>
          {serverError && (
            <p className="text-rose-500">
              server error, please try again later
            </p>
          )}

          <Button
            type="submit"
            variant="shadow"
            color="secondary"
            isRequired
            isDisabled={isSubmitting ? true : false}
          >
            {isSubmitting && (
              <Spinner size="sm" color="current" className=" mr-1" />
            )}{" "}
            Sign up
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    const loginBody = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginBody),
      });
      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ email: loginBody.email, username: data.username })
        );
        router.push("/");
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(true);
    }

    setIsSubmitting(false);
  };

  const setGuestCredentials = () => {
    setEmail("account@demo.com");
    setPassword("12345");
  };

  return (
    <Card>
      <CardBody className="bg-zinc-800">
        <form
          className="space-y-6 flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Input
            type="email"
            autocomplete="on"
            label="Email"
            variant="faded"
            isInvalid={loginError}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Add this line
          />
          <Input
            type="password"
            autocomplete="current-password"
            label="Password"
            variant="faded"
            isInvalid={loginError}
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Add this line
          />
          {loginError && (
            <p className="text-rose-500">Invalid email or password</p>
          )}
          <Button
            type="submit"
            variant="shadow"
            color="secondary"
            isDisabled={isSubmitting ? true : false}
          >
            {isSubmitting && (
              <Spinner size="sm" color="current" className=" mr-1" />
            )}{" "}
            Log in
          </Button>
          <Button
            variant="ghost"
            color="secondary"
            onClick={setGuestCredentials}
          >
            Log in as guest
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

function Page() {
  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col dark mx-auto max-w-lg py-8">
        <div className="bg-zinc-700 border border-zinc-600 p-4 rounded-2xl">
          <Tabs color="primary" fullWidth size="md" aria-label="Tabs form">
            <Tab key="LogIn" title="Log in">
              <LoginForm />
            </Tab>
            <Tab key="SignUp" title="Sign up">
              <SignUpForm />
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
