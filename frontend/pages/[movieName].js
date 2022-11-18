import Layout from "../components/layout";
import { moviesData } from "../moviesData";
import { useState } from "react"

export default function Movie({ movieData }) {

    const [rated, setRated] = useState(false)
    const [beingRated, setBeingRated] = useState(false)
    const [rating, setRating] = useState(null)

    const handleRateMovie = () => {
        if(rating>0 && rating <=10) {
            // setBeingRated(false)
            console.log("Movie Rating function")
        }
        else {
            alert("Please enter valid value")
        }
    }

    return (
        <Layout>
            <div className="flex">
                <div className="basis-3/4">
                    <p className="text-3xl font-bold">{movieData.name[0].toUpperCase()}{movieData.name.substring(1)}</p>
                    <p className="mt-2">{movieData.release}</p>
                    <img src={`/movies/${movieData.name.replaceAll(' ', '_')}.jpeg`} alt="" className="mt-4 block w-[30%] border" />
                    <p className="mt-6"><span>Director</span><span className="ml-4 text-blue-400 text-xl">{movieData.director}</span></p>
                </div>
                <div className="basis-1/4">
                    <div>
                        <p>WMDB Rating</p>
                        <i className="ml-2 mt-3 fas fa-star text-pink-400 text-xl"></i><span className="ml-2"><span className="text-2xl font-semibold">8.5</span>/10</span>
                    </div>

                    <div className="mt-8">
                        <p>Your Rating</p>
                        {rated ? (
                            <div>
                                <i className="mt-3 fas fa-star text-pink-400 text-xl"></i><span className="ml-2"><span className="text-2xl font-semibold">8.5</span>/10</span>
                            </div>
                        ) : (
                            <button className="hover:bg-pink-200 p-3" onClick={() => setBeingRated(true)}>
                                <i className="far fa-star text-blue-400 text-xl"></i><span className="ml-2 text-blue-400 text-xl">Rate</span>
                            </button>
                        )}
                    </div>
                    {beingRated && (
                        <dialog open className="w-96 bg-gray-600">
                            <i className="float-right text-white fa fa-close text-xl cursor-pointer" onClick={() => setBeingRated(false)}></i>
                            <div className="mt-6 text-center">
                                <p className="text-yellow-400 text-sm">Rate This</p>
                                <p className="mt-2 text-white text-2xl">{movieData.name}</p>
                                <input className="block text-center mx-auto mt-2 bg-gray-100 px-4 py-2 w-20" type="number" name="Movie Rating" placeholder="" value={rating} onChange={(e) => { setRating(e.target.value) }} />
                                <button className="mt-4 mb-6 px-20 py-2 text-gray-100 bg-gray-500 hover:text-gray-300" onClick={handleRateMovie}>Rate</button>
                            </div>
                            
                        </dialog>
                    )}
                    

                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = moviesData.map((movie) => {
        return {
            params: {
                movieName: String(movie.name),
            }
        }
    })

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    let movieData = {}
    for (let i = 0; i < moviesData.length; i++) {
        if (moviesData[i].name == params.movieName) {
            movieData = moviesData[i]
        }
    }

    return {
        props: {
            movieData,
        },
    };
}