import Layout from "../components/layout";
import { moviesData } from "../moviesData";
import { useState } from "react"

export default function Movie({ movieData }) {

    const [rated, setRated] = useState(false)

    const handleRateMovie = () => {

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
                            <button className="hover:bg-pink-200 p-3" onClick={handleRateMovie}>
                                <i className="far fa-star text-blue-400 text-xl"></i><span className="ml-2 text-blue-400 text-xl">Rate</span>
                            </button>
                        )}

                    </div>

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