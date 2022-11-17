import Layout from "../components/layout";
import { moviesData } from "../moviesData";

export default function Movie({ movieData }) {

    return (
        <Layout>
            <p>{movieData.name}</p>
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