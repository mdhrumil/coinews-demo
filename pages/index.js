import Head from 'next/head'
import Link from 'next/link'
import { populateCacheWithCurrencyInfo } from '../lib/cachebuilder'
import SearchBar from '../components/SearchBar'

export async function getServerSideProps() {
  populateCacheWithCurrencyInfo()
  return {
    props: {
      msg: "Cache loaded successfully"
    }
  }
}
export default function Home(props) {

  return (
    <>
    <Head>
      <title>Coinews - Beautiful cryptocurrency chart and real-time twitter feeds.</title>
    </Head>
    <SearchBar />
    <footer>Developed by Dhrumil Mayur Mehta.</footer>
    </>
  )
}