import Link from 'next/link'
import { useAuth } from '../utils/authProvider.js';

const shortenAddress = (address) => {
    if (address)
        return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
}

export default function Layout({ children }) {

    const { currentAccount, setCurrentAccount } = useAuth()

    return (
        <div className="h-screen p-6">
            <div>
                <header className="flex justify-between mb-6">
                    <div className="flex items-center">
                        <h3 className="text-2xl font-extrabold"><Link href="/">WMDB</Link></h3>
                        {currentAccount && <p className="ml-8 text-gray-600"><Link href="/dashboard">Dashboard</Link></p>}
                    </div>
                    {currentAccount ? (
                        <h4>{shortenAddress(currentAccount)}</h4>
                    ) : (
                        <button className="px-4 py-2 border-2 border-black hover:border-gray-400 rounded" onClick={setCurrentAccount}>Connect Wallet</button>
                    )}
                </header>
                <main>
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