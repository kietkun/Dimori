import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Home.css";
import Account from "../components/Account";
import { Link } from "react-router-dom";
import bg from "../images/dimori-bg1.JPG";
import logo from "../images/dimori-logo.png";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { TextField, Button, Input } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";

const Home = () => {
  const data = useSelector((state) => state.blockchain.value)

  const [info, setInfo] = useState(
    { destination: "", checkIn: new Date(), checkOut: new Date(), theme: "" }
  )

  return (
    <>
      <div className="homeContainer" style={{
        backgroundImage: `url(${bg})`,
        width: "100%",
        opacity: "0.9"
      }}>
        <div className="containerGradinet"></div>
      </div>
      <div className="topBanner">
        <div>
          <img className="logo" src={logo} alt="logo" style={{height:"auto"}}></img>
        </div>
        <div className="lrContainers">
          <Account />
        </div>
      </div>
      <div className="randomLocation">
        <div className="title">Dimori</div>
        <div className="text">
          Design your best local trip
        </div>
        <div className="text">
          A decentralized home-sharing platform using cryptocurrency for payment.
        </div>
        <Button
          text="Explore A Location"
          onClick={() => console.log(info.checkOut)}
        />
      </div>
      <div className="tabContent">
        <div className="searchFields">
          <div className="inputs">
            <Input
              required={true}
              placeholder="Location"
              type="text"
              onChange={(e) => {
                setInfo({ ...info, destination: e.target.value })
              }}
            />
          </div>
          <div className="vl" />
          <div className='inputs'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkIn}
                onChange={(newValue) => {
                  setInfo({ ...info, checkIn: newValue })
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </div>

          <div className="vl" />
          <div className='inputs'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkOut}
                onChange={(newValue) => {
                  setInfo({ ...info, checkOut: newValue })
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </div>

          <div className="vl" />
          <div className="inputs">
            <Input
              required={true}
              name="AddTheme"
              placeholder="Theme"
              type="text"
              onChange={(e) => {
                setInfo({ ...info, theme: e.target.value })
              }}
            />
          </div>
          {data.network === networksMap[networkDeployedTo] ? (
            <Link to={"/rentals"} state={{
              destination: info.destination,
              checkIn: info.checkIn,
              checkOut: info.checkOut,
              theme: info.theme
            }}>
              <div className="searchButton">
                <SearchIcon sx={{ color: "#2b2623" }} />
              </div>
            </Link>
          ) : (
            <div className="searchButton"
              onClick={() => { window.alert(`Please Switch to the ${networksMap[networkDeployedTo]} network`) }}>
              <SearchIcon sx={{ color: "#2b2623" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
