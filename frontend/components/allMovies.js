import { ethers } from 'ethers';
import { MOVIES_NFT_CONTRACT_ADDRESS } from '../utils/constants';
import { MOVIES_CONTRACT_ABI } from '../utils/contract_abis'
import { useEffect } from "react"
import { moviesData } from '../moviesData';
import Link from 'next/link';

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

    }, [])

    const handleGetAllMovies = async () => {
        moviesContract.getAllMovies({
            gasLimit: '3000000'
        }).then(function (resp) {
            console.log("========= getAllMovies response: ", resp);
        });
    }

    return (
        <div>
            {/* <button className="block px-4 py-2 bg-pink-400 mb-4" onClick={handleGetAllMovies}>Get ALL Movie NFTs</button> */}
            <div className="flex flex-wrap gap-10 cursor-pointer justify-around">
                {moviesData.map((movie) => (
                    <Link href={`/${movie.name}`}>
                        <div className="text-center">
                            <img src={`/movies/${movie.name.replaceAll(' ', '_')}.jpeg`} alt="" className="border mx-auto w-48 h-72" />
                            <p className="mt-2">{movie.name}</p>
                            <p>{movie.release}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default AllMovies