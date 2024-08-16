const sleep = (interval) => {
    console.log("Waiting for ",interval,'ms...')
}
const sleep1 = function(interval){
    console.log("Waiting for ",interval,'ms...')

}
while(true){
    sleep(1000);
    sleep1(2000);
}