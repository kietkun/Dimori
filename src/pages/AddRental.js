import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./AddRental.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import { Buffer } from "buffer";
import { Form } from "react-bootstrap";
import { Button, CircularProgress } from "@mui/material";
import Account from "../components/Account";

import logo from "../images/dimori-logo.png";
import bg from "../images/add-bg.png";

import DimoriSmartContract from "../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";

const client = require("ipfs-http-client");

const projectId = "2HrcvAMNAkZmAGwQO6CfyZPWAw0"; // <---------- your Infura Project ID

const projectSecret = "924de794db26653232257f0e12208ecd"; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfsClient = client.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const ipfsBaseUrl = "https://ipfs.io/ipfs/";

const Rentals = () => {
  let navigate = useNavigate();

  const data = useSelector((state) => state.blockchain.value);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    city: "",
    theme : "",
    contactAddress : "",
    latitude: "",
    longitude: "",
    description: "",
    numberGuests: 0,
    pricePerDay: 0,
  });

  const getImage = async (e) => {
    e.preventDefault();
    const reader = new window.FileReader();
    const file = e.target.files[0];

    if (file !== undefined) {
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        const buf = Buffer(reader.result, "base64");
        setImage(buf);
        setImagePreview(file);
      };
    }
  };

  const addRental = async () => {
    if (data.network == networksMap[networkDeployedTo]) {
      if (image !== undefined && window.ethereum !== undefined) {
        try {
          setLoading(true);
          const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
          );
          const signer = provider.getSigner();

          const DimoriContract = new ethers.Contract(
            contractAddress,
            DimoriSmartContract.abi,
            signer
          );

          const listingFee = DimoriContract.callStatic.listingFee();
          //handle images
          const addedFile = await ipfsClient.add(image);
          const imageURI = ipfsBaseUrl + addedFile.path;

          const add_tx = await DimoriContract.addRental(
            formInput.name,
            formInput.city,
            formInput.theme,
            formInput.contactAddress,
            formInput.latitude,
            formInput.longitude,
            formInput.description,
            imageURI,
            formInput.numberGuests,
            utils.parseEther(formInput.pricePerDay, "ether"),
            { value: listingFee }
          );
          await add_tx.wait();

          setImage(null);
          setLoading(false);

          navigate("/your-rentals");
        } catch (err) {
          window.alert("An error has occured");
          setLoading(false);
          console.log(err);
        }
      } else {
        window.alert("Please Install Metamask");
      }
    } else {
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }
  };

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
        <div className="lrContainers">
          <Account />
        </div>
      </div>

      <hr className="line" />
      <br />
      <br />
      <div className="addRentalContent">
        <div className="addRentalContentL" style={{ alignItems: "center" }}>
          <h2 style={{ textAlign: "center" }}>Add your Rental</h2>
          <table className="pure-table pure-table-horizontal">
            <br />
            <tr>
              <td></td>
              <td>
                <label>Name: </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Tên chi?"
                  onChange={(e) => {
                    setFormInput({ ...formInput, name: e.target.value });
                  }}
                  required={true}
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>City: </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  maxLength={30}
                  placeholder="Ở mô?"
                  onChange={(e) => {
                    setFormInput({ ...formInput, city: e.target.value });
                  }}
                  required
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Theme: </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  maxLength={30}
                  placeholder="Có gì zui?"
                  onChange={(e) => {
                    setFormInput({ ...formInput, theme: e.target.value });
                  }}
                  required
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Location Address: </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  maxLength={255}
                  placeholder="Có gì zui?"
                  onChange={(e) => {
                    setFormInput({ ...formInput, contactAddress: e.target.value });
                  }}
                  required
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Latitude : </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  maxLength={30}
                  placeholder="Kinh độ"
                  onChange={(e) => {
                    setFormInput({ ...formInput, latitude: e.target.value });
                  }}
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Longitude : </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  maxLength={30}
                  placeholder="Vĩ độ"
                  onChange={(e) => {
                    setFormInput({ ...formInput, longitude: e.target.value });
                  }}
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Description : </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  as="textarea"
                  rows={5}
                  maxLength={2000}
                  placeholder="Kể coi tụi bây có chi?"
                  onChange={(e) => {
                    setFormInput({ ...formInput, description: e.target.value });
                  }}
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Max number of guests : </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="number"
                  min={1}
                  placeholder="Chỗ tụi bây chứa được mấy người?"
                  onChange={(e) =>
                    setFormInput({
                      ...formInput,
                      numberGuests: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td>
                <label>Price per day: </label>
              </td>
              <td></td>
              <td>
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="Một ngày trả bây mấy $"
                  onChange={(e) =>
                    setFormInput({ ...formInput, pricePerDay: e.target.value })
                  }
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td colspan="3">
                <Form.Control
                  type="file"
                  name="file"
                  onChange={(e) => {
                    getImage(e);
                  }}
                />
              </td>
              <td></td>
            </tr>
            <br />
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                {imagePreview && (
                  <div style={{ textAlign: "center" }}>
                    <img
                      className="rounded mt-4"
                      width="350"
                      src={URL.createObjectURL(imagePreview)}
                      style={{margin: "auto", display: "block"}}
                    />
                  </div>
                )}
              </td>
              <td></td>
            </tr>
          </table>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#00afd1" }}
              onClick={addRental}
            >
              {loading ? <CircularProgress color="inherit" /> : "Add"}
            </Button>
          </div>
          <br />
        </div>
        <div className="addRentalContentR">
          <img
            src={bg}
            style={{ height: "65vw", width: "45vw" }}
            alt="logo"
          ></img>
        </div>
      </div>
    </>
  );
};

export default Rentals;
