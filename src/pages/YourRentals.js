import React, { useState, useEffect } from "react";
import "./YourRentals.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import logo from "../images/dimori-logo.png";
import { useSelector } from "react-redux";
import Account from "../components/Account";

import DimoriSmartContract from "../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../utils/contracts-config";

const YourRentals = () => {
  const data = useSelector((state) => state.blockchain.value);

  const [propertiesList, setPropertiesList] = useState([]);

  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const rentals = await DimoriContract.getRentals();

    const user_properties = rentals.filter((r) => r[1] == data.account);
    const items = user_properties.map((r) => {
      return {
        name: r[2],
        city: r[3],
        theme: r[4],
        address: r[5],
        description: r[8],
        imgUrl: r[9],
        price: utils.formatUnits(r[11], "ether"),
      };
    });
    setPropertiesList(items);
  };

  useEffect(() => {
    getRentalsList();
  }, [data.account]);

  return (
    
      // <div
      //   className="homeContainer"
      //   style={{
      //     backgroundColor:"black",
      //     width: "100%",
      //     opacity: "0.9",
      //     backgroundAttachment: "scroll"
      //   }}
      // >
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
            <h3 class="headerText">Your Rentals</h3>
          </div>
          <div className="lrContainers">
            <Account />
          </div>
        </div>
        <hr className="line" />
        <div className="rentalsContent" class="newContainer">
          {propertiesList.length !== 0 ? (
            propertiesList.map((e, i) => {
              return (
                <>
                  <hr className="line2" />
                  <br/>
                  <div className="rentalDiv" key={i}>
                    <img className="rentalImg" src={e.imgUrl}></img>
                    <div className="rentalInfo">
                      <div className="rentalTitle">{e.name}</div>
                      <div className="rentalDesc">ở (in) {e.city}</div>
                      <div className="rentalDesc">
                        màu của tụi tau là : {e.theme} đơn giản rứa thui
                      </div>
                      <div className="rentalDesc">
                        địa chỉ cụ thể á hả (address) : {e.address}
                      </div>
                      <div className="rentalDesc">
                        mô tả sơ sơ thôi (description) :{" "}
                      </div>
                      <div className="rentalDesc">{e.description}</div>
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
              <p>You have no rentals listed</p>
            </div>
          )}
          <div style={{ textAlign: "center", paddingTop: "15px" }}>
            <a className="btn btn-primary" href={"/#/add-rental"} role="button">
              Add rental
            </a>
          </div>
        </div>
      
    </>
    // </div>
  );
};
export default YourRentals;
