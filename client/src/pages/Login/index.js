import React, { useContext, useState } from "react";
import api from "../../services/api";
import { Container, Button, Form, Alert, FormGroup, Input } from "reactstrap";
import { UserContext } from "../../user-context";

function Login({ history }) {
  const { setIsLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(`Result of the submit: ${email} ${password}`);
    //send to BE route /login email & password
    const response = await api.post("/login", { email, password });
    //get from BE user-id to store it in history
    //to allow the user navigate through the site
    //BE=>LoginController:
    //return res.json({
    //   user: token,
    //   user_id: userResponse._id,});
    const user_id = response.data.user_id || false;
    const user = response.data.user || false;

    try {
      if (user && user_id) {
        //local storage in browser & store user+user_id
        localStorage.setItem("user", user);
        localStorage.setItem("user_id", user_id);
        setIsLoggedIn(true);
        //redirect to allowed page
        history.push("/");
      } else {
        //if user is not loged in
        //get message from response
        const { message } = response.data;
        //"User not found" from BE
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMessage("The server returned the Error...");
    }
  };

  return (
    <Container>
      <h2>Login:</h2>
      <p>
        Please <strong>Login</strong> into your account
      </p>
      <Form onSubmit={handleSubmit}>
        <div className="input-group">
          <FormGroup className="form-group-"></FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">Submit</Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/register")}>
            New Account
          </Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">
          {errorMessage}
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
}
export default Login;
