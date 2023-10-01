function idGenerator () {

    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    const randomNumString = randomNum.toString();
    return randomNumString;
    
}
module.exports = idGenerator;




