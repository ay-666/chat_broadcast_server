function random(num : number){
    const longString = 'qwertyuiop0987651QWERTYUIOP!@#$%^&*()'
    let res = "";

    for(let i=1 ;i <=5;i++){
        const ind = Math.floor(Math.random() * longString.length);
        res += longString[ind];
    }
    return res;
}