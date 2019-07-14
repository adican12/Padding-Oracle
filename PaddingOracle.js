const fetch = require('node-fetch')
const key = '42a5bb740acf753b'
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
   } 
async function GetChallenge(){
    var challenge
    await fetch('http://localhost:3000/getChallenge').then(res => res.json()).then(json => {
        challenge = json
    })
    solveChallenge(challenge)
}

function hex2a(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


async function solveChallenge(){
    let challenge = '4807aaf9c94fa7ef4568351a7d250f20abc20cff93be7ae5f876136425f09de1a3c4b3c39c736d758fa83f3bc2a8a2f73bbf6d44141508e685ea17a3de964fc9278eca7a5efd724fa4c6a4b33a0d17b6c25c50e9103542d9'
    let array = Buffer.from(challenge, 'hex')
    let PlainText = []

    for(let i = 0; i < array.length; ++i){

        let temp = array[array.length - 1]

        for(let j = 0; j < 256; ++j){
            let tempVal = Buffer.alloc(array.length);
            array.copy(tempVal);
            tempVal[tempVal.length - 1] ^= j

            let body = {
                data: tempVal.toString('hex'),
                key: key
            }

            let res = await fetch('http://localhost:3000/attemptChallenge', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            
            let data = await res.json()
            if(data.error === 'tag'){
                console.log(`found: ${j ^ 1} for: ${temp}`)
                PlainText.push(j ^ 1)
            }
        }

        tempbuffer = Buffer.alloc(array.length);
        tempbuffer.fill(0);
        array.copy(tempbuffer, 1, 0, array.length);

        array = Buffer.from(tempbuffer)
        console.log(array.toString('hex'))
    }
    
    var string = hex2a(PlainText)
    
    console.log(string)
}

solveChallenge()