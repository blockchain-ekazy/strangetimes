import { LazyLoadImage } from "react-lazy-load-image-component";
import { whiteids } from "./whitelist.js";

import React, { useEffect, useState } from "react";
import abi from "./abi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Home.css";
import logo from "../Imgs/Logo.png";

export default function Home() {
  const [shownIds, setShownIds] = useState([0]);
  const [showPages, setShowPages] = useState([0]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selected, setSelected] = useState(false);
  const [acceptance, setAcceptance] = useState(true);
  const [rd, setRd] = useState([]);

  const REACT_APP_CONTRACT_ADDRESS =
    "0x4Cdc8D12C1f457F81A4E15cA3bE9AD49dC5bbf9B";
  const SELECTEDNETWORK = "4";
  const SELECTEDNETWORKNAME = "Ethereum";

  let ct, web3;
  let white = [];

  const loadweb3 = async () => {
    window.web3 = new Web3(window.ethereum);
    web3 = window.web3;
    if (!checkNetwork()) return false;
    ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);

    let m = await window.ethereum.request({ method: "eth_requestAccounts" });
    m = m[0];
    let p = (await ct.methods.PRICE().call()) * selectedIds.length;

    if ((await web3.eth.getBalance(m)) < p) {
      toast.error("Insufficient Eth Balance for reserve!");
      return;
    }

    await toast.promise(
      ct.methods.reserve(selectedIds).send({ from: m, value: p }),
      {
        pending: "Reserve in Progress!!",
        success: "Reserve Success!!",
        error: "Reserve Rejected!!",
      }
    );
  };

  async function checkNetwork() {
    if ((await web3.eth.net.getId()) == SELECTEDNETWORK) return true;
    toast.error('Enable "' + SELECTEDNETWORKNAME + '" network!');
    return false;
  }

  useEffect(() => {
    white = whiteids;
    showIDs(0);
    showpages();
    try {
      initializeWeb3();
    } catch (err) {}
  }, [0]);

  const initializeWeb3 = async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      web3 = window.web3;

      if (!checkNetwork()) return false;

      ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);

      setRd(await ct.methods.getreserved().call());
      showIDs(0);
      // white = whiteids.filter((e) => !rd.includes(String(e)));
    } else {
      toast.error(
        "Non-Ethereum browser detected. Please use a crypto wallet such as MetaMask!"
      );
      return false;
    }
  };

  function selectAnId(id) {
    let arr = selectedIds;
    arr.push(id);
    setSelectedIds(Array.from(new Set(arr)));
    setSelected(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deselectAnId(id) {
    let arr = selectedIds.filter((e) => e != id);
    setSelectedIds(arr);
    if (arr.length == 0) setSelected(false);
  }

  function showIDs(p) {
    let arr = [];
    for (let i = 0; i < 500; i++) {
      if (white.length > i + p * 500) arr[i] = white[i + p * 500];
    }
    setShownIds(arr);
  }

  function showpages() {
    let arr = [];
    for (let i = 0; i < white.length / 500; i++) {
      arr.push(
        <span
          className="mx-1 d-inline-block"
          onClick={() => {
            showIDs(i);
          }}
        >
          {i + 1}
        </span>
      );
    }
    setShowPages(arr);
  }

  async function searchReserve() {
    let s = document.getElementById("search").value;

    window.web3 = new Web3(window.ethereum);
    web3 = window.web3;
    if (!checkNetwork()) return false;
    ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);
    let rd = await ct.methods.getreserved().call();

    if (rd.includes(s)) toast.error("Id already Reserved!!");
    else {
      selectAnId(s);
    }
  }

  return (
    <div className="AAA">
      <div className="px-4">
        <div className="text-center">
          <img src={logo} className="logo" />
          <b>FG/MAYC</b>
        </div>
        {!selected ? (
          <div className="info">
            <p>
              This project exists to 1) build on the groundbreaking work that
              Ryder Ripps has initiated with the RR/BAYC. 2) get you another
              badass piece of conceptional art in the form of a mutant ape
              &nbsp;3) generate funds to help various Jewish focused charities
              4) generate awareness and discussion on NFT ownership and IP
              rights 5) dispel rumors that Ryder doesn’t care about charity as
              this project exists b/c of him and is aligned with his goals to
              generate funds for good. &nbsp;
              <br />
              <br />
              On Monday, June 6, 2022 after getting the blessing from the
              Godfather (Ryder Ripps) to create the FG/MAYC, I began creating
              new work in the form of NFTs based on the MAYC images.
              &nbsp;Through the process of “re-minting”, the original MAYC
              images are recontextualized – illuminating truths about their
              origins and meanings as well as the nature of Web3 – the power of
              NFTs to change meaning, establish provenance and evade censorship.
            </p>

            <p>
              Remember,
              <b>
                <a
                  href="https://foundation.app/@ryder_ripps/foundation/60312"
                  target="_blank"
                >
                  {" "}
                  you can't copy an NFT.
                </a>{" "}
              </b>{" "}
            </p>

            <p>
              Ryder’s NFT work has been centered around provocations and
              inquiries regarding the nature of NFT, provenance and digital
              ownership. Provenance has always been the definitive aspect in
              establishing an artwork’s meaning and value. The technology of
              NFTs is widely misunderstood, but in its greatest form, it enables
              an immutable trace of origin in time to the publisher/creator of a
              digital work.
            </p>
            <p>
              Since December of 2021, Ryder and others have been investigating
              the most prominent NFT project, Bored Ape Yacht Club and its
              creators, Yuga Labs. Through months of intensive research, Ryder
              and other community members have discovered extensive connections
              between BAYC and subversive internet nazi troll culture. You can
              read the findings at
              <b>
                {" "}
                <a href="https://gordongoner.com/" target="_blank">
                  http://GordonGoner.com
                </a>
              </b>
              , warning this website contains sensitive content not suitable for
              children.
            </p>
            <p>
              FG/MAYC uses satire and appropriation to protest and educate
              people regarding The Bored Ape Yacht Club, The Mutant Ape Yacht
              Club, and the framework of NFTs. The work is an extension of and
              in the spirit of other artists who have worked within the field of
              <b>
                <a
                  href="https://en.wikipedia.org/wiki/Appropriation_(art)"
                  target="_blank"
                >
                  {" "}
                  appropriation art
                </a>
              </b>
              .
            </p>
            <p>
              The RR/BAYC collection was delisted from the Foundation
              marketplace on May 17th, 2022 when Yuga Labs sent a DMCA takedown
              request. Two hours later Yuga Labs{" "}
              <b>
                <a
                  href="https://res.cloudinary.com/middlemarch/image/upload/v1653359126/misc/Yuga_Labs_FG%20Labs_Ripps_DMCA_Letter.gif"
                  target="_blank"
                >
                  {" "}
                  formally capitulated, withdrawing their DMCA request.
                </a>
              </b>
              The current terms of ownership set forth by Yuga Labs to BAYC
              token holders are unclear and do not meet current copyright
              standards. Clearly defining what we are buying when we purchase an
              NFT is one of the primary goals of this work. &nbsp;We strive for
              enlightenment and education on these important IP ownership
              discussions.
            </p>

            <p>
              Please have a look at the works available and reserve what you
              like.
              <br />
              <br />
              FG Labs plans to mint and provide your reserved mutant within 2
              business days or faster.
            </p>

            <p>
              If you have any questions feel free to contact us at{" "}
              <a href="mailto:FG@FGMAYC.COM" target="_blank">
                FG@FGMAYC.COM
              </a>
              .
            </p>

            <p>
              - FG Labs &amp; Ryder Ripps
              <br />
              <br />
            </p>
          </div>
        ) : (
          <div className="selection">
            <h6 className="title mt-3">FG/MAYC I want to reserve:</h6>
            <div className="row items">
              {selectedIds.length == 1 ? (
                <div className="col-12 p-3">
                  <div onClick={() => deselectAnId(selectedIds[0])}>
                    <LazyLoadImage
                      src={"http://fgmayc.com/imgs/" + selectedIds[0] + ".png"}
                    />
                    <span className="apeid">#{selectedIds[0]}</span>
                  </div>
                </div>
              ) : (
                selectedIds.map(function (x, i) {
                  return (
                    <div className="col-6 p-2">
                      <div onClick={() => deselectAnId(x)}>
                        <LazyLoadImage
                          src={"http://fgmayc.com/imgs/" + x + ".png"}
                        />
                        <span className="apeid">#{x}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <label class="containercheck">
              <small>
                <input
                  type="checkbox"
                  id="acceptance"
                  onClick={() => {
                    setAcceptance(
                      !document.getElementById("acceptance").checked
                    );
                  }}
                />{" "}
                By purchasing this FG LABS artwork in the form of an NFT, you
                understand that this is a new mint of MAYC imagery,
                re-contextualizing it for educational purposes, as protest and
                satirical commentary. You cannot copy an NFT. Please see the
                FG/MAYC contract here to verify provenance:{" "}
                <a
                  target="_blank"
                  href="https://etherscan.io/address/0x2EE6AF0dFf3A1CE3F7E3414C52c48fd50d73691e"
                >
                  Etherscan
                </a>
                . By reserving your FG/MAYC, you are purchasing a hold for an
                order that will be fulfilled or rejected/refunded by FG LABS
                within 24h (Depending on the vibe of your wallet and the mood of
                FG LABS and Ryder at the time).
              </small>
            </label>
            <button
              className="w-100 btn btn-dark py-3 connectbutton"
              onClick={() => loadweb3()}
              disabled={acceptance}
            >
              Connect wallet to reserve
            </button>
          </div>
        )}
      </div>
      <div className="text-center">
        <h6 className="title">Reserve Mutants</h6>
        <input className="search" id="search" />
        <br />
        <button
          className="mt-2 btn btn-dark py-3 connectbutton"
          onClick={() => searchReserve()}
        >
          Reserve
        </button>
      </div>
      <div className="text-center pb-5 pagenum">
        <h6 className="title">Page #</h6>
        {showPages}
      </div>
      <div className="container-fluid">
        <div className="row items">
          {shownIds.map(function (x, i) {
            return (
              <div className="col-6 col-sm-4 col-md-2 p-2">
                {rd.includes(String(x)) || selectedIds.includes(x) ? (
                  <div className="opacitylow">
                    <LazyLoadImage
                      src={"http://fgmayc.com/imgs/" + x + ".png"}
                    />
                    <span className="apeid">#{x}</span>
                  </div>
                ) : (
                  <div onClick={() => selectAnId(x)}>
                    <LazyLoadImage
                      src={"http://fgmayc.com/imgs/" + x + ".png"}
                    />
                    <span className="apeid">#{x}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
