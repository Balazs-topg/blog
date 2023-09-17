"use client";

import { Checkbox, NextUIProvider } from "@nextui-org/react";

import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";

import React from "react";
import Nav from "../components/Nav";

function page() {
  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col dark mx-auto max-w-lg py-8">
        <div className="bg-zinc-700 border border-zinc-600 p-4 rounded-2xl">
          <Tabs
            color="primary"
            fullWidth
            size="md"
            aria-label="Tabs form"
            //selectedKey={selected}
            //onSelectionChange={setSelected}
          >
            <Tab key="LogIn" title="Log in">
              <Card>
                <CardBody className="bg-zinc-800 space-y-6">
                  <Input type="email" label="Email" variant="faded" />
                  <Input type="password" label="Password" variant="faded" />
                  <Button variant="shadow" color="secondary">
                    Log in
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="SignUp" title="Sign up">
              <Card>
                <CardBody className="bg-zinc-800 space-y-6">
                  <Input type="name" label="Username" variant="faded" />
                  <Input type="email" label="Email" variant="faded" />
                  <Input type="password" label="Password" variant="faded" />
                  <Checkbox>I consent to my info being stored</Checkbox>
                  <Button variant="shadow" color="secondary" isRequired>
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

export default page;
