# PoS Taxation
Taxation calculation for PoS (Proof of stake) tokens

**Need to see your PoS Taxation result now? Check out our website — [postaxation.com](https://postaxation.com).**

## Background

### Current Problem
The current problem with how staking reward income is measured is the lack of accounting for dilution. The dilution comes from the expansion of the overall supply of cryptocurrency in a blockchain network. The expansion occurs every time rewards are generated. The rate of the expansion proportionately dilutes rewards.

Without accounting for dilution, your economic gain from staking is overstated, and your reward income will be overtaxed.

### Academic Literature About The Problem

This is a link to Tax Notes article, ["Dilution and True Economic Gain From Cryptocurrency Block Rewards" by Sutherland and Landoni, 2020](https://www.taxnotes.com/special-reports/cryptocurrency/dilution-and-true-economic-gain-cryptocurrency-block-rewards/2020/08/14/2ctmc)

### Our Solution
Our solution is PoS Taxation ©, a web tool where users enter their staking address and the corresponding blockchain and taxation period. The user is then shown their transformed income metric with dilution accounted for.

## Deployment

### Requirements
To deploy the server, you need to have at least the following things.
- Express js 
> npm install express
- MongoDB
> npm install mongodb
- Server (no matter if it is Heroku, AWS EC2, or Local)
> ssh

### Steps
The following instructions will guide you through deploying the backend code onto an AWS EC2 server (Ubuntu 18.04).

At first, download the repo code onto your EC2 server after you connect to the EC2 server.
> git clone git@github.com:tianshanghong/pos-taxation.git

Enter the project root folder.

> cd pos-taxation/

Install the necessary packages. The project is based on node.js version v10.22.1. If you haven’t had node.js environment, please install node.js first.

> npm i

Remember to start your local MongoDB before you run the project.

> sudo systemctl start mongod

Set the environment variable for the production mode.

> NODE_ENV=production

Install CLI tool "forever" for ensuring that the program runs continuously. Then, start the server service using `forever`.

> npm install forever -g

> forever start --minUptime 1000 --spinSleepTime 1000 app.js -a

Suppose you see “info: Forever processes running” congratulations! You start the server service successfully! You can check the program running status and log file path using command `forever list` anytime.

Note: If you find there are all null values in the returned data, don’t worry. That’s because the server has not synced enough data with your local MongoDB yet. The service will sync data periodically. It usually takes at most 90 minutes. If you cannot wait that long, you can manually run `node db_init.js` to update the local database. The `db_init.js` will output "The database is fully synchronized." in your console once the initial sync has finished.

### Interfacing

The following instructions will guide you how to locally interface with your locally deployed server. 

First, complete the server deployment process above.

Then, after downloading the interface module, open index.html on your web browser. 

The websocket will be initted with your local server and you will be interfacing
