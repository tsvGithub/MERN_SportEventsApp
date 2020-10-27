import React, { useState, useMemo } from "react";
import api from "../../services/api";
import { Container, Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import cameraIcon from "../../assets/camera.png";
import "./events.css";

export default function EventsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const user_id = localStorage.getItem("user");
  console.log(user_id);
  //useMemo => refresh the page and do not lose thumbnail
  const preview = useMemo(() => {
    //if there is a thumbnail
    //The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
    //re-render only if thumbnail changes
  }, [thumbnail]);

  const submitHandler = async (evt) => {
    evt.preventDefault();
    // const user_id = localStorage.getItem("user");

    const eventData = new FormData();
    //get from multi-form data:
    eventData.append("thumbnail", thumbnail);
    eventData.append("sport", sport);
    eventData.append("title", title);
    eventData.append("price", price);
    eventData.append("description", description);
    eventData.append("date", date);

    try {
      console.log("Event has been sent");
      //send to BE data from Form & headers with user_id
      const response = await api.post("/event", eventData, { headers: { user_id } });
      if (response) {
        console.log(eventData);
        console.log("Event has been saved");
      } else {
        setErrorMessage(true);
      }
    } catch (error) {
      console.log(error);
    }
    // try {
    //   if (title !== "" && description !== "" && price !== "" && sport !== "" && date !== "" && thumbnail !== null) {
    //     console.log("Event has been sent");
    //     //send to BE data from Form & headers with user_id
    //     await api.post("/event", eventData, { headers: { user_id } });
    //     console.log(eventData);
    //     console.log("Event has been saved");
    //   } else {
    //     setErrorMessage(true);
    //     setTimeout(() => {
    //       setErrorMessage(false);
    //     }, 2000);

    //     console.log("Missing required data");
    //   }
    // } catch (error) {
    //   // Promise.reject(error);
    //   console.log(error);
    // }
  };
  console.log(title, description, price, sport);

  return (
    <Container>
      <h2>Create your Event</h2>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label>Upload Image: </Label>
          <Label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={thumbnail ? "has-thumbnail" : ""}
          >
            <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
            <img src={cameraIcon} style={{ maxWidth: "50px" }} alt="upload icon image" />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>Sport: </Label>
          <Input
            id="sport"
            type="text"
            value={sport}
            placeholder={"Sport name"}
            onChange={(evt) => setSport(evt.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Title: </Label>
          <Input
            id="title"
            type="text"
            value={title}
            placeholder={"Event Title"}
            onChange={(evt) => setTitle(evt.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Event description: </Label>
          <Input
            id="description"
            type="text"
            value={description}
            placeholder={"Event Description"}
            onChange={(evt) => setDescription(evt.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Event price: </Label>
          <Input
            id="price"
            type="text"
            value={price}
            placeholder={"Event Price £0.00"}
            onChange={(evt) => setPrice(evt.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Event date: </Label>
          <Input id="date" type="date" value={date} onChange={(evt) => setDate(evt.target.value)} required />
        </FormGroup>
        <Button type="submit">Create Event</Button>
      </Form>
      {errorMessage ? (
        <Alert className="event-validation" color="danger">
          Missing required information
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
}
