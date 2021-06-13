import requests, datetime, sys, time
from dateutil.rrule import rrule, DAILY
from pymongo import MongoClient

# print(requests.get('https://api.tzkt.io/v1/statistics?offset=0&limit=10000').json()[0])

START_DATE = datetime.datetime(2018,  7, 3)
END_DATE = datetime.datetime.utcnow()

START_URL = 'https://api.coingecko.com/api/v3/coins/tezos/history?date='
END_URL = '&localization=false'

client = MongoClient("mongodb+srv://admin:lelloliar9876@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority")
db = client.AnalysisDep
blockchains = db.blockchains

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
                date = date.strftime('%m-%d-%Y')
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

initPrices()

    # in db_update.js update most recent date (day of update)  
    # in UTC time

# def updateTotalSupplys():
#     # 