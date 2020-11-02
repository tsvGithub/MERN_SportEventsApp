import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import moment from "moment";
import { Alert, Button, ButtonGroup } from "reactstrap";
import socketio from "socket.io-client";
import "./dashboard.css";

//Dashboard shows all the events
export default function Dashboard({ history }) {
  const [events, setEvents] = useState([]);

  const user = localStorage.getItem("user");
  const user_id = localStorage.getItem("user_id");

  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [eventsRequest, setEventsRequest] = useState([]);

  // console.log(user_id);

  useEffect(() => {
    getEvents();
  }, []);

  const socket = useMemo(() => socketio("http://localhost:8000", { query: { user: user_id } }), [user_id]);
  useEffect(() => {
    // const socket = socketio("http://localhost:8000/", { query: { user_id } });
    // socket.on("Zhur", (response) => console.log(response));
    // socket.on("registration_request", (data) => console.log(data));
    socket.on("registration_request", (data) => setEventsRequest([...eventsRequest, data]));
  }, [eventsRequest, socket]);

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query);
  };

  const myEventsHandler = async () => {
    // debugger;
    try {
      setRSelected("myevents");
      const response = await api.get("/user/events", { headers: { user: user } });
      // console.log("DBPAGE: RESPONSE", response);
      // console.log("DBPAGE: response.data.events", response.data.events);
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };
  const getEvents = async (filter) => {
    try {
      const url = filter ? `/dashboard/${filter}` : "/dashboard";
      const response = await api.get(url, { headers: { user: user } });
      // console.log(response.data.events);
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user: user } });
      setSuccess(true);
      setMessageHandler("The event was deleted successfully!");
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler("Error when deleting event!");
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    history.push("/login");
  };

  const registrationRequestHandler = async (event) => {
    try {
      await api.post(`/registration/${event.id}`, {}, { headers: { user } });

      setSuccess(true);
      setMessageHandler(`The request for the event ${event.title} was successfully!`);
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler(`The request for the event ${event.title} wasn't successfully!`);
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  return (
    <>
      <ul className="notifications">
        {eventsRequest.map((request) => {
          console.log(request);
          return (
            <li key={request.id}>
              <div>
                <strong>{request.user.email} </strong> is requesting to register to your Event{" "}
                <strong>{request.event.title}</strong>
              </div>
              <ButtonGroup>
                <Button color="secondary" onClick={() => {}}>
                  Accept
                </Button>
                <Button color="danger" onClick={() => {}}>
                  Cancel
                </Button>
              </ButtonGroup>
            </li>
          );
        })}
      </ul>{" "}
      <div className="filter-panel">
        Filter:
        <ButtonGroup>
          <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>
            All Sports
          </Button>
          <Button color="primary" onClick={myEventsHandler} active={rSelected === "myevents"}>
            My Events
          </Button>

          <Button color="primary" onClick={() => filterHandler("running")} active={rSelected === "running"}>
            running
          </Button>
          <Button color="primary" onClick={() => filterHandler("cycling")} active={rSelected === "cycling"}>
            cycling
          </Button>
          <Button color="primary" onClick={() => filterHandler("swimming")} active={rSelected === "swimming"}>
            swimming
          </Button>
          <Button color="primary" onClick={() => filterHandler("other")} active={rSelected === "other"}>
            other
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="secondary" onClick={() => history.push("events")}>
            Events
          </Button>
          <Button color="danger" onClick={logoutHandler}>
            Logout
          </Button>
        </ButtonGroup>
      </div>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id}>
            {/* {console.log({ event })} */}
            <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
              {event.user === user_id ? (
                <div>
                  <Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>
                    Delete
                  </Button>
                </div>
              ) : (
                ""
              )}
            </header>
            <strong>{event.title}</strong>
            <span>Event Date: {moment(event.date).format("LL")}</span>
            <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
            <span>Event Description: {event.description}</span>
            <Button color="primary" onClick={() => registrationRequestHandler(event)}>
              Registration Request
            </Button>
          </li>
        ))}
      </ul>
      {error ? (
        <Alert className="event-validation" color="danger">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
    </>
  );
}

// export default Dashboard;
