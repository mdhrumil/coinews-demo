import { getFiatCurrencies, getCryptoCurrencies, getTickerInformation, getHistoricPrices } from "./dataloader"
import fs, { fdatasync } from 'fs'

var callback = () => {
    console.log("Cached successfully.")
}

export async function populateCacheWithCurrencyInfo() {
    var allFiatCurrencies = await getFiatCurrencies()
    var allCryptoCurrencies = await getCryptoCurrencies()
    var allCurrencies = allFiatCurrencies.concat(allCryptoCurrencies)

    var json = JSON.stringify(allCurrencies)
    fs.writeFile('cache/allCurrenciesInfo.json', json, 'utf8', callback);

}

export async function populateCacheWithHistoricData(ticker) {
    var historicData = await getHistoricPrices(ticker);
    var json = JSON.stringify(historicData)
    fs.writeFile('cache/' + ticker + '_historicData.json', json, callback);
}