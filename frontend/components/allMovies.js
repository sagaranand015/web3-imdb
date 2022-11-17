import { ethers } from 'ethers';
import { MOVIES_NFT_CONTRACT_ADDRESS } from '../utils/constants';
import { MOVIES_CONTRACT_ABI } from '../utils/contract_abis'
import { useEffect } from "react"
import { moviesData } from '../moviesData';

const AllMovies = () => {

    const { ethereum } = window
    const pr = new ethers.providers.Web3Provider(ethereum);
    const signer = pr.getSigner()

    const moviesContract = new ethers.Contract(
        MOVIES_NFT_CONTRACT_ADDRESS,
        MOVIES_CONTRACT_ABI,
        signer
    );

    useEffect(() => {

    },[])

    const handleGetAllMovies = async () => {
        moviesContract.getAllMovies({
            gasLimit: '3000000'
        }).then(function (resp) {
            console.log("========= getAllMovies response: ", resp);
        });
    }

    return (
        <div>
            <button className="block mt-4 px-4 py-2 bg-pink-400" onClick={handleGetAllMovies}>Get ALL Movie NFTs</button>
        </div>
    )
}

export default AllMovies