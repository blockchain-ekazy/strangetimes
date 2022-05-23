import React, { useState } from "react";
import abi from "./abi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { white } from "./whitelist.js";

import os from "../Imgs/os.svg";
import "./Home.css";

export default function Home() {
  const REACT_APP_CONTRACT_ADDRESS =
    "0xB2A2c7fB3E326c5ef282cB78207fbD9dcBA8e983";
  const SELECTEDNETWORK = "1";
  const SELECTEDNETWORKNAME = "Ethereum";

  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(0);
  const [price, setPrice] = useState("X");
  const [maxallowed, setMaxallowed] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  let ct, web3;
  const leaf = white.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaf, keccak256, { sortPairs: true });

  function checkWhitelist(a) {
    const check = keccak256(a);
    const proof = merkleTree.getHexProof(check);
    const root = merkleTree.getRoot();

    return merkleTree.verify(proof, check, root);
  }

  function getProof(a) {
    const check = keccak256(a);
    return merkleTree.getHexProof(check);
  }
  const loadweb3 = async () => {
    if (!initializeWeb3()) return;
    if (!connectWallet()) return;

    let p = price * quantity;
    if ((await web3.eth.getBalance(metamaskAddress)) < p) {
      toast.error("Insufficient Funds!");
      return;
    }

    let m = await ct.methods.numberMinted(metamaskAddress).call();

    if (m >= maxallowed) {
      toast.error("Already Minted Maximum Allowed!");
      return;
    }

    if (status == 1) {
      await toast.promise(
        ct.methods
          .phase1mint(quantity)
          .send({ from: metamaskAddress, value: p }),
        {
          pending: "Mint in Progress!!",
          success: "Mint Success!!",
          error: "Mint Failed!!",
        }
      );
      return;
    } else if (status == 2) {
      await toast.promise(
        ct.methods
          .whitelistMint(quantity, getProof(metamaskAddress))
          .send({ from: metamaskAddress, value: p }),
        {
          pending: "Mint in Progress!!",
          success: "Mint Success!!",
          error: "Mint Failed!!",
        }
      );
      return;
    } else if (status == 3) {
      await toast.promise(
        ct.methods.mint(quantity).send({ from: metamaskAddress, value: p }),
        {
          pending: "Mint in Progress!!",
          success: "Mint Success!!",
          error: "Mint Failed!!",
        }
      );
      return;
    }
  };

  async function checkNetwork() {
    if ((await web3.eth.net.getId()) == SELECTEDNETWORK) return true;
    toast.error('Enable "' + SELECTEDNETWORKNAME + '" network!');
    return false;
  }

  setTimeout(() => {
    initializeWeb3();
  }, 10);

  const initializeWeb3 = async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      web3 = window.web3;

      if (!checkNetwork()) return false;

      ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);
      setStatus(await ct.methods.status().call());
      setPrice(await ct.methods.PRICE().call());
      setMaxallowed(await ct.methods.MAX_PER_Address().call());
      return true;
    } else {
      toast.error(
        "Non-Ethereum browser detected. Please use a crypto wallet such as MetaMask!"
      );
      return false;
    }
  };

  const connectWallet = async () => {
    console.log(merkleTree.getRoot().toString("hex"));
    if (!initializeWeb3()) return false;
    await window.ethereum.enable();
    let m = await web3.eth.getAccounts();
    m = m[0];
    setMetamaskAddress(m);

    if (status == 0) {
      toast.error("Sale not Started!");
      return false;
    } else if (status == 1) {
      if (m == "0xF142D7bAFF0986B50ae24e694419C65e7091f52c") {
        setWalletConnected(true);
        return true;
      } else {
        toast.error("Unauthorized");
        return false;
      }
    } else if (status == 2) {
      if (checkWhitelist(m)) {
        setWalletConnected(true);
        return true;
      } else {
        toast.error("Not Whitelisted");
        return false;
      }
    } else if (status == 3) {
      setWalletConnected(true);
    }
  };

  return (
    <div className="AAA">
      <div className="container-fluid  ">
        <div className="row sev1">
          <div className="col-md-12 text-center p-0">
            <h1 className="sev">STRANGE TIMES</h1>
          </div>
        </div>

        <div className="row hy pt-5 px-2 justify-content-center">
          <div className="col-12 opt">
            <h3 className="text-white py-4">
              <small>
                {status == 1 || status == 2
                  ? "PRE SALE ACTIVE"
                  : status == 3
                  ? "PUBLIC SALE ACTIVE"
                  : "SALE NOT ACTIVE"}
              </small>
              <br />
              <small>
                Price: {((price / 10 ** 18) * quantity).toFixed(2)}ETH
              </small>
              <br />
              <small>Max per Address: {maxallowed}</small>
            </h3>

            <div className="quantityselector d-flex justify-content-center align-items-center pb-2">
              <button
                className="count btn mx-4 "
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity ">
                {quantity}
                <span
                  className="d-block text-white maxbtn p-1"
                  onClick={() => setQuantity(maxallowed)}
                >
                  MAX
                </span>
              </span>
              <button
                className="count btn mx-3 "
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= maxallowed}
              >
                +
              </button>
            </div>

            <br />
            <br />

            <svg
              className="bubbles"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
            >
              <defs>
                <filter id="gooey">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="5"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="highContrastGraphic"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="highContrastGraphic"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
            {walletConnected ? (
              <button onClick={loadweb3} id="gooey-button">
                MINT
                <span className="bubbles">
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                </span>
              </button>
            ) : (
              <button onClick={connectWallet} id="gooey-button">
                CONNECT
                <span className="bubbles">
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                  <span className="bubble"></span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container uty">
        <div className="row ">
          <div className="col-md-4"></div>
          <div className="col-md-4 text-center">
            <a href="https://twitter.com/NFTStrangeTimes" target="_blank">
              <i className="btc px-2 fa-brands fa-twitter"></i>
            </a>
            <a href="https://t.co/XtxgBThUjG" target="_blank">
              <i className="btc px-2 fa-brands fa-discord"></i>
            </a>
            <a
              href="https://opensea.io/collection/strange-times-ahal-magi"
              target="_blank"
              style={{ fontSize: "45px" }}
            >
              <img src={os} style={{ height: "35px" }} className="px-2" />
            </a>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </div>
  );
}
