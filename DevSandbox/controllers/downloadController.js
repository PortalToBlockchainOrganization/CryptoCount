const downloadCSVResource = require('../util');
const request = require('request');

exports.balanceHistory = async (req, res) => {
    if (req.query.address && req.query.start && req.query.end) {
        const address = req.query.address;
        const start = req.query.start;
        const end = req.query.end;
        const startDate = Math.round(new Date(start).getTime() / (1000 * 60 * 60 * 24));
        const endDate = Math.round(new Date(end).getTime() / (1000 * 60 * 60 * 24));
        const fields = [
            {
                label: 'Timestamp',
                value: 'timestamp'
            },
            {
                label: 'Balance',
                value: 'balance'
            }
        ];
        request({
            method: 'GET',
            url: `https://api.tzkt.io/v1/accounts/${address}/balance_history?limit=10000`,
            header: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
        }, function (error, response, body) {
            if (error) res.status(400).json({ error: 'request error' });
            try {
                if (response.statusCode !== 200) {
                    res.status(response.statusCode).json({ error: 'no valid data' });
                } else {
                    const data = JSON.parse(body);
                    if (data.length == 0) {
                        return res.status(404).send('no valid data');
                    } else {
                        let endOfDays = [];
                        let prevDate = Math.round(new Date(data[0]['timestamp']).getTime() / (1000 * 60 * 60 * 24)) - 1;
                        let prevElement = null;
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            const date = Math.round(new Date(element['timestamp']).getTime() / (1000 * 60 * 60 * 24));
                            if (date > prevDate && date >= startDate && date <= endDate + 1) {
                                prevDate = date;
                                endOfDays.push({ timestamp: element['timestamp'], balance: element['balance'] / 1000000 });
                            } else {
                            }
                            prevElement = element;
                        }
                        return downloadCSVResource(res, `Balance History of ${address}.csv`, fields, endOfDays);
                    }
                }
            } catch (error) {
                res.status(500).json({ error: error });
            }
        })
    } else {
        res.status(500).json({ error: 'please check input params' });
    }
}
