import requests, datetime, sys, time, math
from dateutil.rrule import rrule, DAILY
from pymongo import MongoClient
from dateutil import parser

# print(requests.get('https://api.tzkt.io/v1/statistics?offset=0&limit=10000').json()[0])

START_DATE = datetime.datetime(2018,  7, 3)
END_DATE = datetime.datetime.utcnow()

START_URL = 'https://api.coingecko.com/api/v3/coins/tezos/history?date='
END_URL = '&localization=false'

client = MongoClient("mongodb+srv://admin:lelloliar9876@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority")
db = client.AnalysisDep
blockchains = db.blockchains2
statistics = db.statistics2
cycles_ = db.cycles2

print(db)
def initPrices():
    # cgecko api from may 30th 2018 to presesnt day
    # and up date db with dates
    dates =[dt.strftime("%d-%m-%Y") for dt in rrule(freq=DAILY, dtstart=START_DATE, until=END_DATE)]
    print(len(dates))
    date_data_chunk = []
    i = 0
    double_check = False
    while i<len(dates):
        date = dates[i]
        print('\n\n\n')
        response = requests.get(START_URL+date+END_URL)
        print(START_URL+date+END_URL)
        if response.status_code == 200:
            response = response.json()
            if 'market_data' in response.keys():
                market_data = response['market_data']
                cur_prices = market_data['current_price']
                market_cap = market_data['market_cap']
                cur_prices = {f'price{k.upper()}': v for k, v in cur_prices.items()}
                market_cap = {f'marketCap{k.upper()}': v for k, v in market_cap.items()}
                date = datetime.datetime.strptime(date, '%d-%m-%Y')
                date = date.strftime('%Y-%m-%d')
                cur_date_data = {'date':date,**market_cap, **cur_prices}
                date_data_chunk.append(cur_date_data)
                # only increment to next date on successful query (200+exp body)
                i+=1
            else:
                print(date)
                print(response)
                time.sleep(61)

        # incase today's date is not available/hit rate limit
        elif i == len(dates)-1:
            i+=1
        
        else:
            time.sleep(61)
            
        if i%100==0:
            blockchains.insert_many(date_data_chunk)
            date_data_chunk = []
            time.sleep(61)

    # when the loop ends, odds are it wont fall on a perfect 100 so we will 
    # by default push the date_data_chunk to make sure our most recent dates 
    # are in our database
    if not(date_data_chunk==[]):
        blockchains.insert_many(date_data_chunk)


    # in db_update.js update most recent date (day of update)  
    # in UTC time

def initTotalSupplys():
    # first we pull the stats from the tzkt api
    stats = []
    offset = 0
    while(True):
        url = (f"https://api.tzkt.io/v1/statistics?offset={offset}&limit=10000")
        response = requests.get(url)
        response = response.json()
        offset = response[len(response) - 1]['level'] + 1
        for data in response:
            stats.append(data)
        if len(response) < 10000:
            break

    # next we format our statisticts for the database
    last_date_number = 0
    last_total_supply = 0
    last_date_string = ''
    stat_docs = []
    for stat in stats:
        date_number = math.floor((parser.parse(stat['timestamp']).timestamp() * 1000) / (1000 * 60 * 60 * 24))
        if (date_number > last_date_number):
            if (last_date_number != 0):
                stat_docs.append({
                    'dateString': last_date_string,
                    'totalSupply': last_total_supply 
                })
        last_date_number = date_number
        last_total_supply = stat['totalSupply']
        last_date_string = str(parser.parse(stat['timestamp']).isoformat())[0:10]

    statistics.insert_many(stat_docs)

def initCycles():
    offset = 0
    cycles = []
    while(True):
        url = f'https://api.tzkt.io/v1/statistics/cyclic?offset={offset}&limit=10000'
        response = requests.get(url)
        response = response.json()
        print(response)
        offset = response[len(response) - 1]['level'] + 1
        for data in response:
            cycles.append(data)
        if len(response) < 10000:
            break

    cycleObj = {}
    for cycle in cycles:
        date_string = str(parser.parse(cycle['timestamp']).isoformat())[0:10]
        cycleObj[date_string] = cycle['cycle'] + 1
    
    days = math.floor((datetime.date.today() - datetime.date(2018,6,30)).days)
    for i in range(days):
        date = (parser.parse("2018-06-30").timestamp() * 1000) + i * 24 * 60 * 60 * 1000
        date = datetime.datetime.fromtimestamp(date//1000.0)
        date_string = date.isoformat()[0:10]
        if date_string in cycleObj:
            if date_string == cycles[len(cycles)-1]['timestamp'][0:10] :
                while i <= days:
                    date = (datetime.datetime.utcnow().timestamp() * 1000) + 1000 * 60 * 60 * 24
                    date = datetime.datetime.fromtimestamp(date//1000.0)
                    cycleObj[str(date.isoformat())[0:10]] = cycles[len(cycles)-1]['cycle'] + 1
                    i += 1
        
        else:
            last_date = (datetime.datetime.utcnow().timestamp() * 1000) - 1000 * 60 * 60 * 24
            last_date = datetime.datetime.fromtimestamp(last_date//1000.0)
            last_date_string = str(last_date.isoformat())[0:10]
            if last_date_string in cycleObj:
                cycleObj[date_string] = cycleObj[last_date_string]
            else:
                cycleObj[date_string] = 0

    cycle_docs = []
    for i in range(days):
        date = (parser.parse("2018-06-30").timestamp() * 1000) + i * 24 * 60 * 60 * 1000
        date = datetime.datetime.fromtimestamp(date//1000.0)
        date_string = date.isoformat()[0:10]
        cycle_docs.append({
            'dateString': date_string,
            'cycleNumber': cycleObj[date_string]
        })
    
    cycles_.insert_many(cycle_docs)

initCycles()