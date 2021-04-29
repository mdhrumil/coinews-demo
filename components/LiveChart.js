import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), {ssr:false})
import React, { Component } from "react";
import historicalData from '../cache/BTC_historicData.json';
import { loadPriceDataWithTicker } from '../lib/dataloader';
import CLOUDS from 'vanta/dist/vanta.clouds2.min';

class LiveChart extends Component {

constructor(props) {
    super(props);
    this.vantaRef = React.createRef();

    this.state = {
      series: [{
            name: '',
            data: historicalData.LIVE.price
        }],
        newVal: 0,
        
        options: {
          chart: {
            id: 'realtime',
            height: 300,
            type: 'line',
            
            zoom: {
              enabled: false
            },
            animations: {
              dynamicAnimation: {
                enabled: true,
                speed: 2000
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          colors: ["#73FF06"],
          title: {
            text: this.props.ticker + ' live data',
            align: 'left',
            style: {
              fontSize:  '14px',
              fontWeight:  'bold',
              fontFamily:  'Aclonica',
              color: "rgba(255,255,255,0.2)",
            },
          },
          grid: {
            show: false,
            
          },
          xaxis: {
            labels: {
              show: false,
            }
          },
          yaxis: {
            labels: {
              style: {
                fontFamily: 'Aclonica',
                colors: ["#FFFFFF"]
              }
            }
          },
          tooltip: {
            style: {
              fontFamily: 'Aclonica'
            }
          }
        },
      
      
      };
}

async fetchNewVal(ticker) {
  var temp = await loadPriceDataWithTicker(ticker)
  return temp.data.data.amount
}

componentDidMount() {

    // this.vantaEffect = CLOUDS({
    //   el: this.vantaRef.current,
    //   mouseControls: false,
    //   touchControls: false,
    //   gyroControls: false,

    //   scale: 1.0,
    //   skyColor: 0x68220,
    //   cloudColor: 0x0,
    //   lightColor: 0x56b22,
    //   speed: 2.20,
    //   texturePath: "./gallery/noise.png"
    // })

    window.setInterval(() => {
        var newValPromise = this.fetchNewVal(this.props.ticker)
        var lastVal = this.state.series[0].data[this.state.series[0].data.length - 1]
        newValPromise.then(function(result) {
          if(Math.ceil(result) != Math.ceil(lastVal)){
            ApexCharts.exec('realtime', 'appendData', [{
              data: [result]
            }])
          }
        })
        
    }, 5000)


}

// componentWillUnmount() {
//   if (this.vantaEffect) this.vantaEffect.destroy()
// }

render() {
    return (
        <div>
          <Chart options={this.state.options} series={this.state.series} type="line" width={1300} height={600} />
        </div>
    )
}
}

export default LiveChart;