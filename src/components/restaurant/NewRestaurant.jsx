import React from "react";
import styled from "styled-components";

// components
import OpeningHours from "../user/OpeningHours";
import ContactInfo from "../user/ContactInfo";
import { RestaurantsContext } from "../../context/restaurants-context";
import Menu from "./Menu";
import ItemPopUp from "../user/ItemPopUp";

const ColorBlock = styled.input`
  height: 50px;
  width: 50px;
  padding: 0;
  border: none;
  margin-right: 2.5px;
  margin-left: 2.5px;
`;

class NewRestaurant extends React.Component {
  static contextType = RestaurantsContext;

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    name: "",
    headerColour: "",
    fontColour: "",
    foregroundColour: "",
    backgroundColour: "",
    opening_hours: { opening_hours: [] },
    restaurant_name: "",
    status: "restaurant",
    seen: false,
    current_menu: "",
  };

  handleChange(event) {
    switch (event.target.id) {
      case "headerColour":
        return this.setState({ headerColour: event.target.value });
      case "fontColour":
        return this.setState({ fontColour: event.target.value });
      case "foregroundColour":
        return this.setState({ foregroundColour: event.target.value });
      case "backgroundColour":
        return this.setState({ backgroundColour: event.target.value });
      case "resName":
        return this.setState({ restaurant_name: event.target.value });
      default:
        console.log("missed");
    }
  }

  setOpeningHours = (data) => {
    this.setState({ opening_hours: data });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const styles = {
      headerColour: this.state.headerColour,
      fontColour: this.state.fontColour,
      foregroundColour: this.state.foregroundColour,
      backgroundColour: this.state.backgroundColour,
    };
    const body = {
      restaurant: {
        name: this.state.restaurant_name,
        opening_hours: JSON.stringify(this.state.opening_hours),
      },
    };
    try {
      const response = await fetch(`http://localhost:3000/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      if (response.status >= 400) {
        const test = await response.json();
        throw new Error(response);
      } else {
        const newRestaurantInfo = await response.json();
        this.context.dispatch("add restaurant", {
          ...newRestaurantInfo,
          contact_infos: [],
          menus: [],
        });
        this.setState({
          restaurant: { ...newRestaurantInfo, contact_infos: [], menus: [] },
          status: "contact",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return this.state.status === "restaurant" ? (
      <>
        <form onSubmit={this.handleSubmit}>
          <p>Restaurant Name:</p>
          <input
            type="text"
            id="resName"
            placeholder="Name"
            value={this.state.restaurant_name}
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </>
    ) : (
      <div>
        {this.state.seen ? (
          <ItemPopUp
            current_menu={this.state.current_menu}
            toggle={this.togglePop}
            updateRestaurant={this.updateRestaurant}
          />
        ) : null}
        <p>Restaurant Name:</p>
        <h1>{this.state.restaurant_name}</h1>
        <hr />
        <p>Opening Hours:</p>
        <OpeningHours
          setOpeningHours={this.setOpeningHours}
          opening_hours={{ opening_hours: [] }}
          restaurant_id={this.state.restaurant.id}
        />
        <p>Contact Details:</p>
        <ContactInfo restaurant={this.state.restaurant} />
        <Menu
          restaurant={this.state.restaurant}
          itemPopUp={this.togglePop}
          updateState={this.updateState}
        />
        <div>
          <label htmlFor="Colour">
            <p>Colour Scheme:</p>
            <div>
              <ColorBlock
                type="color"
                value={this.state.headerColour}
                onChange={this.handleChange}
                id="headerColour"
              />
              <p>Header Colour</p>
            </div>
            <div>
              <ColorBlock
                type="color"
                value={this.state.fontColor}
                onChange={this.handleChange}
                id="fontColour"
              />
              <p>Font Colour</p>
            </div>
            <div>
              <ColorBlock
                type="color"
                value={this.state.foregroundColour}
                onChange={this.handleChange}
                id="foregroundColour"
              />
              <p>Foreground Colour</p>
            </div>
            <div>
              <ColorBlock
                type="color"
                value={this.state.backgroundColour}
                onChange={this.handleChange}
                id="backgroundColour"
              />
              <p>Background Colour</p>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

export default NewRestaurant;
