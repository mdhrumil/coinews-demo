import {config} from '../config/config'
import axios from 'axios'


var callback = () => {
    console.log("Cached successfully.")
}

export async function loadPriceDataWithTicker(ticker) {
    
    var data = await axios.get('https://api.coinbase.com/v2/prices/' + ticker +  '-USD/spot')
        .then(response => {
            if(response.status === 200){
                return {
                    type: "success",
                    data: response.data
                }
            }
            else{
                return {
                    type: "error",
                    data: response.status
                }
            }
        }, error_msg => {
            console.log("Something went wrong")
            return {
                type: "error",
                data: error_msg["message"]
            }
        });
    
    return data;

}

export function getFiatCurrencies() {

    var response = axios.get('https://api.coinbase.com/v2/currencies')
        .then(response => {
            if(response.status === 200){
                var data = response.data["data"].map(entry => {
                    return {
                        id: entry.id,
                        name: entry.name ? entry.name : ""
                    }
                })
                return data;
            }
        }, error => {
            console.log("Something went wrong")
            console.log(error)
        });

    return response;
}

export function getCryptoCurrencies() {

    var response = axios.get('https://rest.coinapi.io/v1/assets?apikey=' + config.coinapiApiKey)
        .then(response => {
            if(response.status === 200){

                var data = response.data.filter(function(i,n) {
                    return i.type_is_crypto === 1;
                })

                var result = data.map(entry => {
                    return {
                        id: entry.asset_id,
                        name: entry.name ? entry.name : ""
                    }
                })

                
                return result;
            }
        }, error => {
            console.log("Something went wrong")
            console.log(error)
        });

    return response;
}

export async function getTickerInformation(ticker) {
    var data = await axios.get('https://rest.coinapi.io/v1/assets/' + ticker + "?apikey=" + config.coinapiApiKey)
        .then(response => {
            if(response.status === 200){
                return {
                    type: "success",
                    data: response.data
                }
            }
        }, error => {
            console.log("Something went wrong here")
            console.log(error)
            return {
                type: "error",
                data: "error is here"
            }
        });
    
    return data;
}

export async function getHistoricPrices(ticker) {

    let today = new Date();
    let todayString = today.toISOString();

    let oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
    let oneYearAgoString = oneYearAgo.toISOString();

    today = new Date();
    let threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
    let threeMonthsAgoString = threeMonthsAgo.toISOString();

    today = new Date();
    let oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    let oneMonthAgoString = oneMonthAgo.toISOString();

    today = new Date();
    let oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    let oneWeekAgoString = oneWeekAgo.toISOString();

    today = new Date();
    let oneDayAgo = new Date(today.setDate(today.getDate() - 1));
    let oneDayAgoString = oneDayAgo.toISOString();

    console.log("Yayy")
    
    var weeklyAllTimeData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=7DAY&time_start=2016-01-01T00:00:00&apikey=" + config.coinapiApiKey)
        .then(response => {
            if(response.status === 200){
                
                var filteredData = response.data.map(entry => {
                    return {
                        price: entry.price_close,
                        volume_traded: entry.volume_traded,
                        trades: entry.trades_count,
                        date: entry.time_period_start
                    }
                })
                
                return {
                    type: "success",
                    name: ticker,
                    data: filteredData
                }
            }
        }, error => {
            console.log("Something went wrong here")
            console.log(error)
            return {
                type: "error",
                data: "error is here"
            }
        });

    var weeklyAllTimeDataPriceArray = weeklyAllTimeData.data.map(entry => {
        return entry.price;
    })

    var weeklyAllTimeDataVolumeArray = weeklyAllTimeData.data.map(entry => {
        return entry.volume_traded;
    })

    var weeklyAllTimeDataTradeCountsArray = weeklyAllTimeData.data.map(entry => {
        return entry.trades_count;
    })

    var weeklyAllTimeDataDatesArray = weeklyAllTimeData.data.map(entry => {
        return entry.date;
    })

    // var dailyOneYearData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=1DAY&time_start=" + oneYearAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
    //     .then(response => {
    //         if(response.status === 200){
                
    //             var filteredData = response.data.map(entry => {
    //                 return {
    //                     price: entry.price_close,
    //                     volume_traded: entry.volume_traded,
    //                     trades: entry.trades_count,
    //                     date: entry.time_period_start
    //                 }
    //             })
                
    //             return {
    //                 type: "success",
    //                 name: ticker,
    //                 data: filteredData
    //             }
    //         }
    //     }, error => {
    //         console.log("Something went wrong here")
    //         console.log(error)
    //         return {
    //             type: "error",
    //             data: "error is here"
    //         }
    //     });
    
    // var dailyOneYearDataPriceArray = dailyOneYearData.data.map(entry => {
    //     return entry.price;
    // })

    // var dailyOneYearDataVolumeArray = dailyOneYearData.data.map(entry => {
    //     return entry.volume_traded;
    // })

    // var dailyOneYearDataTradeCountsArray = dailyOneYearData.data.map(entry => {
    //     return entry.trades_count;
    // })

    // var dailyOneYearDataDatesArray = dailyOneYearData.data.map(entry => {
    //     return entry.date;
    // })
    
    // var dailyThreeMonthsData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=1DAY&time_start=" + threeMonthsAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
    //     .then(response => {
    //         if(response.status === 200){
                
    //             var filteredData = response.data.map(entry => {
    //                 return {
    //                     price: entry.price_close,
    //                     volume_traded: entry.volume_traded,
    //                     trades: entry.trades_count,
    //                     date: entry.time_period_start
    //                 }
    //             })
                
    //             return {
    //                 type: "success",
    //                 name: ticker,
    //                 data: filteredData
    //             }
    //         }
    //     }, error => {
    //         console.log("Something went wrong here")
    //         console.log(error)
    //         return {
    //             type: "error",
    //             data: "error is here"
    //         }
    //     });
    
    // var dailyThreeMonthsDataPriceArray = dailyThreeMonthsData.data.map(entry => {
    //     return entry.price;
    // })

    // var dailyThreeMonthsDataVolumeArray = dailyThreeMonthsData.data.map(entry => {
    //     return entry.volume_traded;
    // })

    // var dailyThreeMonthsDataTradeCountsArray = dailyThreeMonthsData.data.map(entry => {
    //     return entry.trades_count;
    // })

    // var dailyThreeMonthsDataDatesArray = dailyThreeMonthsData.data.map(entry => {
    //     return entry.date;
    // })

    
    // var dailyOneMonthData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=1DAY&time_start=" + oneMonthAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
    //     .then(response => {
    //         if(response.status === 200){
                
    //             var filteredData = response.data.map(entry => {
    //                 return {
    //                     price: entry.price_close,
    //                     volume_traded: entry.volume_traded,
    //                     trades: entry.trades_count,
    //                     date: entry.time_period_start
    //                 }
    //             })
                
    //             return {
    //                 type: "success",
    //                 name: ticker,
    //                 data: filteredData
    //             }
    //         }
    //     }, error => {
    //         console.log("Something went wrong here")
    //         console.log(error)
    //         return {
    //             type: "error",
    //             data: "error is here"
    //         }
    //     });
    
    // var dailyOneMonthDataPriceArray = dailyOneMonthData.data.map(entry => {
    //     return entry.price;
    // })

    // var dailyOneMonthDataVolumeArray = dailyOneMonthData.data.map(entry => {
    //     return entry.volume_traded;
    // })

    // var dailyOneMonthDataTradeCountsArray = dailyOneMonthData.data.map(entry => {
    //     return entry.trades_count;
    // })

    // var dailyOneMonthDataDatesArray = dailyOneMonthData.data.map(entry => {
    //     return entry.date;
    // })
    
    // var hourlyOneWeekData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=1HRS&time_start=" + oneWeekAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
    //     .then(response => {
    //         if(response.status === 200){
                
    //             var filteredData = response.data.map(entry => {
    //                 return {
    //                     price: entry.price_close,
    //                     volume_traded: entry.volume_traded,
    //                     trades: entry.trades_count,
    //                     date: entry.time_period_start
    //                 }
    //             })
                
    //             return {
    //                 type: "success",
    //                 name: ticker,
    //                 data: filteredData
    //             }
    //         }
    //     }, error => {
    //         console.log("Something went wrong here")
    //         console.log(error)
    //         return {
    //             type: "error",
    //             data: "error is here"
    //         }
    //     });

    // var hourlyOneWeekDataPriceArray = hourlyOneWeekData.data.map(entry => {
    //     return entry.price;
    // })

    // var hourlyOneWeekDataVolumeArray = hourlyOneWeekData.data.map(entry => {
    //     return entry.volume_traded;
    // })

    // var hourlyOneWeekDataTradeCountsArray = hourlyOneWeekData.data.map(entry => {
    //     return entry.trades_count;
    // })

    // var hourlyOneWeekDataDatesArray = hourlyOneWeekData.data.map(entry => {
    //     return entry.date;
    // })


    // var fiveMinutedOneDayData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=5MIN&time_start=" + oneDayAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
    //     .then(response => {
    //         if(response.status === 200){
                
    //             var filteredData = response.data.map(entry => {
    //                 return {
    //                     price: entry.price_close,
    //                     volume_traded: entry.volume_traded,
    //                     trades: entry.trades_count,
    //                     date: entry.time_period_start
    //                 }
    //             })
                
    //             return {
    //                 type: "success",
    //                 name: ticker,
    //                 data: filteredData
    //             }
    //         }
    //     }, error => {
    //         console.log("Something went wrong here")
    //         console.log(error)
    //         return {
    //             type: "error",
    //             data: "error is here"
    //         }
    //     });

    // var fiveMinutedOneDayDataPriceArray = fiveMinutedOneDayData.data.map(entry => {
    //     return entry.price;
    // })

    // var fiveMinutedOneDayDataVolumeArray = fiveMinutedOneDayData.data.map(entry => {
    //     return entry.volume_traded;
    // })

    // var fiveMinutedOneDayDataTradeCountsArray = fiveMinutedOneDayData.data.map(entry => {
    //     return entry.trades_count;
    // })

    // var fiveMinutedOneDayDataDatesArray = fiveMinutedOneDayData.data.map(entry => {
    //     return entry.date;
    // })

    
    var oneMinOneDayData = await axios.get("https://rest.coinapi.io/v1/ohlcv/" + ticker + "/USD/history?period_id=1MIN&time_start=" + oneDayAgoString + "&time_end="+ todayString + "&apikey=" + config.coinapiApiKey)
        .then(response => {
            if(response.status === 200){
                
                var filteredData = response.data.map(entry => {
                    return {
                        price: entry.price_close,
                        volume_traded: entry.volume_traded,
                        trades: entry.trades_count,
                        date: entry.time_period_start
                    }
                })
                
                return {
                    type: "success",
                    name: ticker,
                    data: filteredData
                }
            }
        }, error => {
            console.log("Something went wrong here")
            console.log(error)
            return {
                type: "error",
                data: "error is here"
            }
        });
    
    var oneMinOneDayDataPriceArray = oneMinOneDayData.data.map(entry => {
        return entry.price;
    })

    var oneMinOneDayDataVolumeArray = oneMinOneDayData.data.map(entry => {
        return entry.volume_traded;
    })

    var oneMinOneDayDataTradeCountsArray = oneMinOneDayData.data.map(entry => {
        return entry.trades_count;
    })

    var oneMinOneDayDataDatesArray = oneMinOneDayData.data.map(entry => {
        return entry.date;
    })
    
    return {
        "LIVE": {
            "price": oneMinOneDayDataPriceArray,
            "date": oneMinOneDayDataDatesArray,
            "volume": oneMinOneDayDataVolumeArray,
            "trade_counts": oneMinOneDayDataTradeCountsArray,
        },

        // "1D": {
        //     "price": fiveMinutedOneDayDataPriceArray,
        //     "date": fiveMinutedOneDayDataDatesArray,
        //     "volume": fiveMinutedOneDayDataVolumeArray,
        //     "trade_counts": fiveMinutedOneDayDataTradeCountsArray,
        // },
        // "7D": {
        //     "price": hourlyOneWeekDataPriceArray,
        //     "date": hourlyOneWeekDataDatesArray,
        //     "volume": hourlyOneWeekDataVolumeArray,
        //     "trade_counts": hourlyOneWeekDataTradeCountsArray,
        // },
        // "1M": {
        //     "price": dailyOneMonthDataPriceArray,
        //     "date": dailyOneMonthDataDatesArray,
        //     "volume": dailyOneMonthDataVolumeArray,
        //     "trade_counts": dailyOneMonthDataTradeCountsArray,
        // },
        // "3M": {
        //     "price": dailyThreeMonthsDataPriceArray,
        //     "date": dailyThreeMonthsDataDatesArray,
        //     "volume": dailyThreeMonthsDataVolumeArray,
        //     "trade_counts": dailyThreeMonthsDataTradeCountsArray,
        // },
        // "1Y": {
        //     "price": dailyOneYearDataPriceArray,
        //     "date": dailyOneYearDataDatesArray,
        //     "volume": dailyOneYearDataVolumeArray,
        //     "trade_counts": dailyOneYearDataTradeCountsArray,
        // },
        "ALLTIME": {
            "price": weeklyAllTimeDataPriceArray,
            "date": weeklyAllTimeDataDatesArray,
            "volume": weeklyAllTimeDataVolumeArray,
            "trade_counts": weeklyAllTimeDataTradeCountsArray,
        }
    };
}