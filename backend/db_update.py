import requests, datetime, sys, time, math
from dateutil.rrule import rrule, DAILY
from pymongo import MongoClient
from dateutil import parser

client = MongoClient("mongodb+srv://admin:<pw>@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority")
db = client.AnalysisDep
blockchains = db.blockchains
statistics = db.statistics
cycles_ = db.cycles


START_URL = 'https://api.coingecko.com/api/v3/coins/tezos/history?date='
END_URL = '&localization=false'

def updatePrices():
    # get latest date in db
    # get all following dates
    startDate = blockchains.find_one(sort=[("date", -1)])['date']
    startYear, startMonth, startDay = [int(x) for x in startDate.split('-')]
    startDate = datetime.datetime(startYear, startMonth, startDay)
    endDate = datetime.datetime.utcnow()
    dates = [dt.strftime("%d-%m-%Y") for dt in rrule(freq=DAILY, dtstart=startDate, until=endDate)]
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

def updateTotalSupplys():
    # first we pull the stats from the tzkt api
    stats = []
    startDate = statistics.find_one(sort=[("dateString", -1)])['dateString']
    startYear, startMonth, startDay = [int(x) for x in startDate.split(' ')[0].split('-')]
    startDate = datetime.datetime(startYear, startMonth, startDay)
    endDate = datetime.datetime.utcnow()
    dates = [dt.strftime("%Y-%m-%d") for dt in rrule(freq=DAILY, dtstart=startDate, until=endDate)]
    print(dates)
    i = 0

    while i<len(dates):
        # use daily stats
        url = (f"https://api.tzkt.io/v1/statistics/daily?date={dates[i]}")
        response = requests.get(url)
        response = response.json()
        if len(response)==0:
            break
        print(response)
        totalSupply = response[0]['totalSupply']
        stats.append({'dateString': dates[i], 'totalSupply':totalSupply})
        i+=1

    statistics.insert_many(stats)

def updateCycles():
    start_cycle = cycles_.find_one(sort=[("cycleNumber", -1)])['cycleNumber']
    cur_cycle = start_cycle
    cycles = []
    while True:
        url = (f"https://api.tzkt.io/v1/statistics/cyclic?cycle={cur_cycle}")
        response = requests.get(url)
        response = response.json()
        if len(response)==0:
            break
        cycles.append({'dateString': response[0]['timestamp'].split('T')[0], 'cycleNumber': cur_cycle})
        cur_cycle+=1
    
    cycles_.insert_many(cycles)

updatePrices()
updateTotalSupplys()
updateCycles()