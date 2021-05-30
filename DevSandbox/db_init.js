//db framework activation through update module 
const {updatePrices, updateTotalSupplys, updateCycles} = require('./db_update');

console.log(`Database sync starts.`)

async function db_update() {
    await updatePrices();
    await updateTotalSupplys();
    await updateCycles();
}

db_update().then(function () {
    console.log(`The database is fully synchronized.`)
    process.exit(0);
})
