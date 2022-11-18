/* global BigInt */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, UploadNftJson } from './nftStorage';
import { DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS, RATERVERIFIER_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI, RATERVERIFIER_CONTRACT_ABI } from './contract_abis';
import { QRCodeSVG } from 'qrcode.react';
import verificationQRCodeJson from './verificationQRCode.json';

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  // metamsk methereum references for all user interactions
  const { ethereum } = window
  const pr = new ethers.providers.Web3Provider(ethereum);
  const signer = pr.getSigner()

  // references to the moviesNFT
  const moviesContract = new ethers.Contract(
    MOVIES_NFT_CONTRACT_ADDRESS,
    MOVIES_CONTRACT_ABI,
    signer
  );

  // reference to the raterVerifier contract
  const raterVerifierContract = new ethers.Contract(
    RATERVERIFIER_CONTRACT_ADDRESS,
    RATERVERIFIER_CONTRACT_ABI,
    signer
  );

  function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  function fromLittleEndian(bytes) {
    const n256 = BigInt(256);
    let result = BigInt(0);
    let base = BigInt(1);
    bytes.forEach((byte) => {
      result += base * BigInt(byte);
      base = base * n256;
    });
    return result;
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please Install Metamask');
    }
    try {
      await ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(function (accounts) {
          setCurrentAccount(accounts[0]);
          console.log(
            '======= Wallet connected, got the address: ',
            accounts[0],
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const isWalletConnected = async () => {
      if (window.ethereum) {
        await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(function (accounts) {
            setCurrentAccount(accounts[0]);
          });
      }
    };
    isWalletConnected();
  }, []);

  async function createMovieNft() {
    // 1. Create the IPFS link of the JSON file
    // 2. Call the smart contract method and get the tokenId
    await UploadNftJson("movie02", "description for movie02", "2010", "Mr. Director", DEMO_MOVIE_IMAGE, {
      "name": "movie02",
      "description": "description for movie02",
      "director": "Mr. Director",
      "release": "2010",
      "imageURL": DEMO_MOVIE_IMAGE,
    }).then(function (resp) {
      console.log("======== response of nft.storage is: ", resp);
      const ipfsUrl = `ipfs://${resp}`
      console.log("======== final ipfs url: ", ipfsUrl);

      moviesContract.createMovieNft("movie02",
        ipfsUrl, {
        gasLimit: '3000000'
      }).then(function (resp) {
        console.log("========= created movies NFT: ", resp);
      });

    });
  }

  async function getAllMovies() {
    moviesContract.getAllMovies({
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("========= getAllMovies response: ", resp);
    });
  }

  async function getMovieByNumber(movieNum) {
    moviesContract.getMovieByNumber(movieNum, {
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log(`Movie Data from Blockchain & IPFS. TokenId: ${resp[0]}, Name: ${resp[1]}, Ipfs: ${resp[2]}`);
      const ipfsMetadata = resp[2];
      FetchDataFromIpfsLink(ipfsMetadata.split("\/")[2]);
    });
  }

  // async function getMovieRatingsByNumber(movieNum) {
  //   moviesContract.getMovieRatings(movieNum, {
  //     gasLimit: '3000000'
  //   }).then(function (resp) {
  //     // console.log(`Movie Ratings:. Address: ${resp[0]}, MovieNum: ${resp[1]}, ratingVal: ${resp[2]}, createdAt: ${resp[3]}`);
  //     console.log("Movie Ratings: ", resp);
  //   });
  // }

  async function castMovieRating(movieNum, ratingVal) {
    moviesContract.castMovieRating(movieNum, ratingVal, {
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("Cast Rating: ", resp);
    });
  }

  async function getUserRatings() {
    moviesContract.getUserRating(currentAccount, {
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("User Ratings Response:", resp);
    });
  }

  async function getAvgForMovie(movieNum) {
    moviesContract.getAvgMovieRating(movieNum, {
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("Average Rating Response:", resp);
    });
  }

  async function setRequestForVerification() {
    const circuitId = "credentialAtomicQuerySig";
    const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";
    const schemaHash = "be159805ee0986bb6480b8c6cfd87743" // extracted from PID Platform
    const schemaEnd = fromLittleEndian(hexToBytes(schemaHash))
    const query = {
      schema: ethers.BigNumber.from(schemaEnd),
      slotIndex: 2,
      operator: 2,
      value: [20020101, ...new Array(63).fill(0).map(i => 0)],
      circuitId,
    };
    // // add the address of the contract just deployed
    // const ERC20VerifierAddress = "0x461b78FCf300CE4eC582B727212fB09a935fCfF9"
    // // let erc20Verifier = await hre.ethers.getContractAt("ERC20Verifier", ERC20VerifierAddress)
    await raterVerifierContract.setZKPRequest(
      1,
      validatorAddress,
      query
    ).then(function (resp) {
      console.log("Request set response: ", resp);
    });
  }

  async function getAllRatings() {
    moviesContract.getAllRatings({
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("All Ratings Response:", resp);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWalletHandler}>Connect Wallet</button>
        <button onClick={createMovieNft}>Create Movie NFT</button>
        <button onClick={getAllMovies}>Get all movies</button>
        <button onClick={() => getMovieByNumber(1)}>Get Movie with TokenId: 1</button>
        <button onClick={() => getMovieByNumber(2)}>Get Movie with TokenId: 2</button>
        <button onClick={() => castMovieRating(1, 10)}>Cast rating: 10 to movie: 1</button>
        <button onClick={() => castMovieRating(2, 8)}>Cast rating: 8 to movie: 2</button>
        {/* <button onClick={() => getMovieRatingsByNumber(2)}>Get Movie Ratings with TokenId: 1</button> */}
        <button onClick={() => getUserRatings()}>Get Current User Ratings</button>
        <button onClick={() => getAvgForMovie(1)}>Get Average Rating of Movie: 1</button>
        <button onClick={() => getAllRatings()}>Get All Ratings</button>
        <button onClick={() => setRequestForVerification()}>Set Request for User Verification</button>
        <br />

        <QRCodeSVG level="Q"
          size="256"
          value={JSON.stringify(verificationQRCodeJson)} />

      </header>
    </div >
  );
}

export default App;
