import React, { useEffect, useState } from "react";
import api from "../../services/api";
import moment from "moment";
import { Alert, Button, ButtonGroup } from "reactstrap";
import "./dashboard.css";

//Dashboard shows all the events
const Dashboard = ({ history }) => {
  const [events, setEvents] = useState([]);
  const user_id = localStorage.getItem("user");
  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // console.log(user_id);

  useEffect(() => {
    getEvents();
  }, []);

  const myEventsHandler = async () => {
    setRSelected("myevents");
    const response = await api.get("/user/events", { headers: { user_id } });
    setEvents(response.data);
  };

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query);
  };

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : "/dashboard";
    const response = await api.get(url, { headers: { user_id } });

    setEvents(response.data);
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
      }, 2500);
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <>
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
        <Button color="secondary" onClick={() => history.push("events")}>
          Events
        </Button>
      </div>

      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id}>
            {console.log({ event })}
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
            <Button color="primary">Subscribe</Button>
          </li>
        ))}
      </ul>
      {error ? (
        <Alert className="event-validation" color="danger">
          Error when deleting event!
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          The event was deleted successfully!
        </Alert>
      ) : (
        ""
      )}
    </>
  );
};

export default Dashboard;
