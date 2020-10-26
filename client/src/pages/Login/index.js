import React, { useState } from "react";
import api from "../../services/api";
import { Container, Button, Form, FormGroup, Input } from "reactstrap";

function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`Result of the submit: ${email} ${password}`);
    //send to BE route /login email & password
    const response = await api.post("/login", { email, password });
    //get from BE user-id to store it in history
    //to allow the user navigate through the site
    const userId = response.data._id || false;

    if (userId) {
      //local storage in browser & store user+userId
      localStorage.setItem("user", userId);
      //redirect to allowed page
      history.push("/dashboard");
    } else {
      //if user is not loged in
      //get message from response
      const { message } = response.data;
      //"User not found" from BE
      console.log(message);
    }
  };

  return (
    <Container>
      <h2>Login:</h2>
      <p>
        Please <strong>Login</strong>into your account
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-2 mr-sm-s mb-sm-0">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-s mb-sm-0">
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
export default Login;
