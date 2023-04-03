# CryptoCount

Free and Open Source Under Apache 2.0.

CryptoCount 0.2.3.2 tracks and mocks up realizations of native Tezos DeFi block rewards with income metrics for tax reporting and asset management.

WebApp: https://cryptocount.co

Data Integration and API Documentation: https://portaltoblockchain.org/client 

CryptoCount 0.3.0 adds Capital Gain calculations for XTZ and token contract transactions, FMV assessments of DeFi/Dapp rewards, and on chain consolidation of tax payments into smart contracts for revenue authority collection.

To follow the latest developments as they happen, join the Discord linked in the website.

# Run 0.2.3.2

Checkout CryptoCount. 

On branch master.

# Build Database
cd backend/src

Initialize a local MongoDb collection -> https://www.mongodb.com/basics/create-database

Paste the URI into backend/src/db_updater.py

Change the final line in db_updater.py to your timezone relative to UTC

Install python requirements.txt

nohup python3 db_updater.py & disown 

or 

python3 db_updater.py


# Server
cd backend

cd documentInterfaces/database.service.ts -> Replace the DB connection URI with your local DB URI

npm install

npm run dev

or 

npm run build

npm start


# Client

cd frontend

npm install 

npm start


# Block Reward Accounting Referenced Academic Literature

https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3672461

