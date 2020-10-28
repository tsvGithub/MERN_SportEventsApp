import React, { useState, useMemo } from "react";
import api from "../../services/api";
import {
  Alert,
  Container,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
import cameraIcon from "../../assets/camera.png";
import "./events.css";

export default function EventsPage({ history }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState("Sport");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user_id = localStorage.getItem("user");
  // console.log(user_id);

  const toggle = () => setDropdownOpen(!dropdownOpen);

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

    // try {
    //   console.log("Event has been sent");
    //   //send to BE data from Form & headers with user_id
    //   const response = await api.post("/event", eventData, { headers: { user_id } });
    //   if (response) {
    //     console.log(eventData);
    //     console.log("Event has been saved");
    //   } else {
    //     setErrorMessage(true);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      if (
        title !== "" &&
        description !== "" &&
        price !== "" &&
        sport !== "Sport" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user_id } });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          history.push("/");
        }, 2000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error);
    }
  };

  const sportEventHandler = (sport) => setSport(sport);
  console.log(sport);

  return (
    <Container>
      <h2>Create your Event</h2>
      <Form onSubmit={submitHandler}>
        <div className="input-group">
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
            <Label>Title: </Label>
            <Input
              id="title"
              type="text"
              value={title}
              placeholder={"Event Title"}
              onChange={(evt) => setTitle(evt.target.value)}
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
            />
          </FormGroup>
          <FormGroup>
            <Label>Event date: </Label>
            <Input
              id="date"
              type="date"
              value={date}
              placeholder={"Event Price £0.00"}
              onChange={(evt) => setDate(evt.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
              <Button id="caret" value={sport} disabled>
                {sport}
              </Button>
              <DropdownToggle caret />
              <DropdownMenu>
                <DropdownItem onClick={() => sportEventHandler("running")}>running</DropdownItem>
                <DropdownItem onClick={() => sportEventHandler("cycling")}>cycling</DropdownItem>
                <DropdownItem onClick={() => sportEventHandler("swimming")}>swimming</DropdownItem>
                <DropdownItem onClick={() => sportEventHandler("other")}>other</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">Submit</Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/")}>
            Cancel
          </Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">
          Missing required information
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          The event was created successfully!
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
}
