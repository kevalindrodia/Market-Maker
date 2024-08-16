function countZeros(val) {
    const numStr = val.toString();
    let count = 0;

    for (let i = 0; i < numStr.length; i++) {
        if (numStr[i] === '0') {
            count++;
        }
    }

    return count;
}

const number = BigInt("10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");

const totalZeros = countZeros(number);

console.log(totalZeros);
