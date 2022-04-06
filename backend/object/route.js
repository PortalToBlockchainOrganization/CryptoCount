generate(/)
    data depends
    gen()
    respond




date realize (/)
    params = load.dates
    realizeMod(dates)
    respond


cap gain (/)
    params = inputs, outputs
    capGains(i/o s)
    respond



saves (/)
    params = capGains(i/o s)
    save state
    respond 


update (/)
    params = saved Object
    generate >> append new rewards and transactions 
    check for modern holdings outs 
    match out transactions with modern holding outs and move out transaction into input output pair over modern holding out 


