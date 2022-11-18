import Link from 'next/link'
import { useAuth } from '../utils/authProvider.js';

const shortenAddress = (address) => {
    if (address)
        return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
}

export default function Layout({ children }) {

    const { currentAccount, setCurrentAccount } = useAuth()

    return (
        <div className="h-screen p-8">
            <div>
                <header className="flex justify-between mb-6">
                    <div className="flex items-center">
                        {/* <h3 className="text-2xl font-extrabold"><Link href="/">WMDB</Link></h3> */}
                        <Link href="/"><img src="/wmdb-logo.png" alt="" className='inline-block w-20 rounded-lg' /></Link>
                        {currentAccount && (
                            <div className="flex">
                                <p className="ml-8 text-gray-600"><Link href="/my-ratings">My Ratings</Link></p>
                                <p className="ml-8 text-gray-600"><Link href="/create-movie">Add Movie</Link></p>
                            </div>
                        )

                        }

                    </div>
                    {currentAccount ? (
                        <div className="flex">
                            <p className="ml-8 text-gray-600"><Link href="/verify">Verify</Link></p>
                            <p className="ml-8 text-gray-600">{shortenAddress(currentAccount)}</p>
                        </div>

                    ) : (
                        <button className="px-4 py-2 border-2 border-black hover:border-gray-400 rounded" onClick={setCurrentAccount}>Connect Wallet</button>
                    )}
                </header>
                <main className='px-8 py-6'>
                    {children}
                </main>
            </div>

            <footer>
                <div className="mt-12 mb-6 border border-grey-600"></div>
                <div className="flex justify-between">
                    <p>Mama always said life was like a box full of chocolates. You never know what you're gonna get. - Forrest Gump</p>
                </div>
            </footer>
        </div>
    )
}