import { loadPriceDataWithTicker, getFiatCurrencies, getTickerInformation, getHistoricPrices } from '../lib/dataloader'
import LiveChart from '../components/LiveChart'
import { populateCacheWithHistoricData } from '../lib/cachebuilder'
import { useState, useEffect, useRef } from 'react';
import CLOUDS from 'vanta/dist/vanta.clouds2.min';

export default function Data(props) {

    const [livePrice, setLivePrice] = useState([])
    useEffect(() => {
        async function getLivePrice() {
          var newprice = await loadPriceDataWithTicker(props.name)
          if (newprice.type === "success"){
              setLivePrice(newprice.data.data.amount)
          }
        }
        getLivePrice()
        const interval = setInterval(() => getLivePrice(), 5000)
        return () => {
          clearInterval(interval);
        }
    }, [])


    const [vantaEffect, setVantaEffect] = useState(0)
    const myRef = useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
        setVantaEffect(CLOUDS({
            el: myRef.current,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
      
            scale: 1.0,
            skyColor: 0x68220,
            cloudColor: 0x0,
            lightColor: 0x56b22,
            speed: 2.20,
            texturePath: "./gallery/noise.png"
          }))
        }
        return () => {
        if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])


    if(props.priceData.type === "success"){
        return (
            <div ref={myRef} className="chartWrapper">
                <h1>{props.info.name ? props.info.name : "Bitcoin"}</h1>
                <p className="livePrice">{livePrice}</p>
                <LiveChart ticker = {props.name}/>
            </div>
        )
    }
    else if(props.priceData.type === "error"){
        return (
            <>
                <h1>This currency is not yet supported. Please check again later.</h1>
                <p>Reason: {props.priceData.data}</p>
            </>
        )
    }
}


export async function getServerSideProps(context) {
    const id = context.params.ticker;
    const priceData = await loadPriceDataWithTicker(id);
    
    if(priceData.type === "success"){
        const cryptoData = await getTickerInformation(id);
        populateCacheWithHistoricData(id);
        return {
            props: {
                name: id,
                priceData: priceData,
                info: cryptoData.data[0]
            }
        };
    }

    else{
        return {
            props: {
                name: id,
                priceData: priceData,
            }
        };
    }

    
}

