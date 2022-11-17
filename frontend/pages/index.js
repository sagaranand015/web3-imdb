import AllMovies from "../components/allMovies";
import Layout from "../components/layout"
import { useAuth } from "../utils/authProvider";


export default function Home() {

  const {currentAccount, setCurrentAccount} = useAuth()


  return (
    <Layout>
      {currentAccount ? (
        <AllMovies />
        ) : (
        <button className="block mt-4 px-4 py-2 bg-pink-400" onClick={setCurrentAccount}>Connect Wallet</button>
      ) }
    </Layout>
  )
}
