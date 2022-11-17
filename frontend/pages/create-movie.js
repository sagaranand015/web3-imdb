import { useState } from "react"
import Layout from "../components/layout"
import { ethers } from 'ethers';
import { UploadNftJson } from '../utils/nftStorage';
import { MOVIES_NFT_CONTRACT_ADDRESS } from '../utils/constants';
import { MOVIES_CONTRACT_ABI } from '../utils/contract_abis'

const CreateMovie = () => {

    const [name, setName] = useState("")
    const [releaseYear, setReleaseYear] = useState("")
    const [director, setDirector] = useState("")
    const [imageURL, setImageURL] = useState("")

    const { ethereum } = window
  const pr = new ethers.providers.Web3Provider(ethereum);
  const signer = pr.getSigner()

  const moviesContract = new ethers.Contract(
    MOVIES_NFT_CONTRACT_ADDRESS,
    MOVIES_CONTRACT_ABI,
    signer
  );

    const handleCreateMovieNFT = async () => {
        if (name && releaseYear && director && imageURL) {
            console.log(name+" "+releaseYear+" "+director+" "+imageURL)
            await UploadNftJson(String(name), "", imageURL, {
                "director": String(director),
                "release": String(releaseYear),
                "cast": ""
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
        else {
            alert("Please enter all values")
        }
    }

    return (
        <Layout>
            <input className="block mt-4 bg-gray-100 px-4 py-2 w-[25%]" type="text" name="Movie Name" placeholder="Movie Name" value={name} onChange={(e) => {setName(e.target.value)}} />
            <input className="block mt-4 bg-gray-100 px-4 py-2 w-[25%]" type="text" name="Release Year" placeholder="Release Year" value={releaseYear} onChange={(e) => {setReleaseYear(e.target.value)}} />
            <input className="block mt-4 bg-gray-100 px-4 py-2 w-[25%]" type="text" name="Director" placeholder="Director" value={director} onChange={(e) => {setDirector(e.target.value)}} />
            <input className="block mt-4 bg-gray-100 px-4 py-2 w-[25%]" type="text" name="Image URL" placeholder="Image URL" value={imageURL} onChange={(e) => {setImageURL(e.target.value)}} />
            <button className="block bg-pink-400 px-4 py-2 mt-4" onClick={handleCreateMovieNFT}>Create Movie NFT</button>
        </Layout>
    )
}

export default CreateMovie