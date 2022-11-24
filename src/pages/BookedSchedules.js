import React, { useState, useEffect } from "react";
import "./BookedSchedules.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import logo from "../images/dimori-logo.png";
import bg from "../images/dimori-bg2.JPG";
import { useSelector } from "react-redux";
import Account from "../components/Account";
import RentalsMap from "../components/RentalsMap";

import DimoriSmartContract from "../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../utils/contracts-config";

const BookedSchedules = () => {
  const data = useSelector((state) => state.blockchain.value);

  const [rentalsList, setRentalsList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [highLight, setHighLight] = useState();

  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const rentals = await DimoriContract.getRentals();
    const myRentals = [];
    await Promise.all(
      rentals.map(async (r) => {
        let _rentalBookings = await DimoriContract.getRentalBookings(
          Number(r[0])
        );

        let myBookings = _rentalBookings.filter((b) => b[0] == data.account);
        if (myBookings.length !== 0) {
          debugger;
          const latestBook = myBookings[0];
          const item = {
            id: Number(r[0]),
            name: r[2],
            city: r[3],
            theme: r[4],
            address: r[5],
            imgUrl: r[9],
            startDate: new Date(Number(latestBook[1]) * 1000),
            endDate: new Date(Number(latestBook[2]) * 1000),
            price: utils.formatUnits(r[11], "ether"),
          };
          myRentals.push(item);
        }
      })
    );
    setRentalsList(myRentals);
    let cords = rentals.map((r) => {
      return {
        lat: Number(r[6]),
        lng: Number(r[7]),
      };
    });

    setCoordinates(cords);
  };

  useEffect(() => {
    getRentalsList();
  }, [data.account]);

  return (
    <>
        <div className="topBanner">
          <div>
            <Link to="/">
              <img
                className="logo"
                src={logo}
                alt="logo"
                style={{ height: "auto" }}
              ></img>
            </Link>
          </div>
          <div>
            <h3 class="headerText">All booked schedules</h3>
          </div>
          <div className="lrContainers">
            <Account />
          </div>
        </div>

        <hr className="line" />
        <div className="rentalsContent">
        <div className="rentalsContentR">
          <div style={{ textAlign: "center", paddingTop: "3%" }}>
                <p>Rentals on maps</p>
              </div>
            <RentalsMap locations={coordinates} setHighLight={setHighLight} style={{border: '2px dotted red'}} />
          </div>
          <div className="rentalsContentR">
            {rentalsList.length !== 0 ? (
              rentalsList.map((e, i) => {
                return (
                  <>
                    <hr className="line2" />
                    <div
                      className={highLight == i ? "rentalDivH " : "rentalDiv"}
                      key={i}
                    >
                      <img className="rentalImg" src={e.imgUrl}></img>
                      <div className="rentalInfo">
                        <div className="rentalTitle">{e.name}</div>
                        <div className="rentalDesc">ở in {e.city} á nè</div>
                        <div className="rentalDesc">
                          màu (theme) {e.theme} thấy được không
                        </div>
                        <div className="rentalDesc">
                          tau để địa chỉ ở đây (at) {e.address}
                        </div>
                        <div className="rentalDesc">
                          Mi đã đặt chỗ ở tụi tau ngày ni nì (Booked dates):
                          {` ${e.startDate.toLocaleString("default", {
                            month: "short",
                          })} ${e.startDate.toLocaleString("default", {
                            day: "2-digit",
                          })}  -  ${e.endDate.toLocaleString("default", {
                            month: "short",
                          })}  ${e.endDate.toLocaleString("default", {
                            day: "2-digit",
                          })} `}
                        </div>
                        <br />
                        <br />
                        <div className="price">{e.price}$</div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div style={{ textAlign: "center", paddingTop: "30%" }}>
                <p>You have no reservation yet</p>
              </div>
            )}
          </div>
          
        </div>
    </>
  );
};

export default BookedSchedules;
