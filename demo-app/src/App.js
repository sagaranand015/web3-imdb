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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWalletHandler}>Connect Wallet</button>
        <button onClick={createMovieNft}>Create Movie NFT</button>
        <button onClick={getAllMovies}>Get all movies</button>
        <button onClick={() => getMovieByNumber(1)}>Get Movie with TokenId: 1</button>
        <button onClick={() => getMovieByNumber(2)}>Get Movie with TokenId: 2</button>
      </header>
    </div >
  );
}

export default App;
