import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, UploadNftJson } from './nftStorage';
import { DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI } from './contract_abis'

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
    await UploadNftJson("movie02", "description for movie02", DEMO_MOVIE_IMAGE, {
      "director": "Abc",
      "release": "2022",
      "cast": "A1, A2 and so on.."
    }).then(function (resp) {
      console.log("======== response of nft.storage is: ", resp);
      const ipfsUrl = `ipfs://${resp}`
      console.log("======== final ipfs url: ", ipfsUrl);

      moviesContract.createMovieNft("movie02",
        "description for movie02",
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
      console.log(`Movie Data from Blockchain & IPFS. TokenId: ${resp[0]}, Name: ${resp[1]}, Desc: ${resp[2]}, Metadata: ${resp[3]}`);
      const ipfsMetadata = resp[3];
      FetchDataFromIpfsLink(ipfsMetadata.split("\/")[2]);
    });
  }

  async function getMovieRatingsByNumber(movieNum) {
    moviesContract.getMovieRatings(movieNum, {
      gasLimit: '3000000'
    }).then(function (resp) {
      // console.log(`Movie Ratings:. Address: ${resp[0]}, MovieNum: ${resp[1]}, ratingVal: ${resp[2]}, createdAt: ${resp[3]}`);
      console.log("Movie Ratings: ", resp);
    });
  }

  async function castMovieRating(movieNum, ratingVal) {
    moviesContract.castMovieRating(movieNum, ratingVal, {
      gasLimit: '3000000'
    }).then(function (resp) {
      console.log("Cast Rating: ", resp);
      console.log(`Cast Ratings Response:. Address: ${resp[0]}, MovieNum: ${resp[1]}, ratingVal: ${resp[2]}, createdAt: ${resp[3]}`);
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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWalletHandler}>Connect Wallet</button>
        <button onClick={createMovieNft}>Create Movie NFT</button>
        <button onClick={getAllMovies}>Get all movies</button>
        <button onClick={() => getMovieByNumber(1)}>Get Movie with TokenId: 1</button>
        <button onClick={() => getMovieByNumber(2)}>Get Movie with TokenId: 2</button>
        <button onClick={() => castMovieRating(1, 9)}>Cast rating: 9 to movie: 1</button>
        <button onClick={() => getMovieRatingsByNumber(2)}>Get Movie Ratings with TokenId: 1</button>
        <button onClick={() => getUserRatings()}>Get Current User Ratings</button>
        <button onClick={() => getAvgForMovie(1)}>Get Average Rating of Movie: 1</button>
      </header>
    </div >
  );
}

export default App;
