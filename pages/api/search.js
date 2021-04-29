import allCurrenciesInfo from '../../cache/allCurrenciesInfo.json'

export default (req, res) => {
    const results = req.query.q ?
        allCurrenciesInfo.filter(function (i, n) {
            return i.id.toUpperCase().includes(req.query.q) || i.name.toUpperCase().includes(req.query.q) || i.id.toLowerCase().includes(req.query.q) || i.name.toLowerCase().includes(req.query.q)
        }).slice(0,6) : []

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ results }))
}