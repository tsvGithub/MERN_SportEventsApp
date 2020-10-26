import React, { useState } from "react";
import api from "../../services/api";
import { Button, Form, FormGroup, Container, Input } from "reactstrap";

export default function Register({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Result of the sumbit: ", email, password, firstName, lastName);

    const response = await api.post("/user/register", { email, password, firstName, lastName });
    const userId = response.data._id || false;

    if (userId) {
      localStorage.setItem("user", userId);
      history.push("/dashboard");
    } else {
      const { message } = response.data;
      console.log(message);
    }
  };
  return (
    <Container>
      <h2>Register:</h2>
      <p>
        Please <strong>Register</strong> for a new account
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Your last name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </Container>
  );
}
