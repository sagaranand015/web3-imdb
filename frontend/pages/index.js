import GetAllMovies from "../components/getAllMovies";
import Layout from "../components/layout"
import { useAuth } from "../utils/authProvider";


export default function Home() {

  const {currentAccount, setCurrentAccount} = useAuth()


  return (
    <Layout>
      Hello World!
      {currentAccount && <GetAllMovies />}
    </Layout>
  )
}
