var accountModified = localStorage.getItem('account')
var accountModified = accountModified.split("")
var newModified = accountModified.splice(5,26)

var accountModified = accountModified.toString()
var accountModified = accountModified.replace(/,/g, '')
var accountModified = accountModified.slice(0, 5) + "..." + accountModified.slice(3);
localStorage.setItem("accountModified", accountModified)
