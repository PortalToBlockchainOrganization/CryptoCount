# CryptoCount

Open Source Under MIT License. 

CryptoCount 0.2.2 tracks and mocks up realizations of native Tezos DeFi block rewards with income metrics for tax reporting and asset management.

WebApp: https://cryptocount.co

API Documentation: https://portaltoblockchain.org/client 

CryptoCount 0.3.0 adds Capital Gain calculations for XTZ and token contract transactions, FMV assessments of DeFi/Dapp rewards, and on chain consolidation of tax payments into smart contracts for revenue authority collection.

To follow the latest developments as they happen, join the Discord linked in the website.

# Run 0.2.2

Checkout CryptoCount. 

On branch master.

# Build Database
cd backend/src

Initialize a local MongoDb collection -> https://www.mongodb.com/basics/create-database

Paste the URL into db_update.py

Install python requirements.txt

nohup python3 db_update.py & disown


# Server
cd backend

cd documentInterfaces/database.service.ts -> Replace the DB connection URI with your local DB URI

npm install

npm run dev

# Client

cd frontend

npm install 

npm start

# Academic Literature

https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3672461

