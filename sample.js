// let file = "1703215923592-Iphone 15 pro 2.png"
// let filename = file.split('-')
// console.log(filename[1])
// let words = ["leet", "code"];

// let nums =['0','0','0']

// if(nums==0){
//     console.log("yes");
// }


// var differenceOfSums = function(n, m) {
//     let div = 0;
//     let nondiv = 0;
//     for(let i=1;i<=n;i++){
//         if(i%m==0){
//             div=+i;
//             console.log(div);
//         }else{
//             nondiv=+i;
//             // console.log(nondiv);
//         }
//     }
//     let result = nondiv-div;
//     console.log(result);
//     return result;
// };

// console.log(differenceOfSums(10,3))

// var differenceOfSums = function(n, m) {
//     let sumDiv = 0;
//     let sumNonDiv = 0;
//     for (let i = 1; i <= n; i++) {
//         if (i % m === 0) {
//             sumDiv += i;
//         } else {
//             sumNonDiv += i;
//         }
//     }
//     let result = sumNonDiv - sumDiv;
//     console.log(result);
//     return result;
// };

// Example usage
// differenceOfSums(10, 3); // Output should be 19


// function greet(){
//     console.log(this.name);
// }

// const person = {
//     name: 'John Doe'
// }

// greet.call(person);

// greet.apply(person,["Jane Doe"]);

// const bind = greet.bind(person);

// bind()

// const number = [1, 2, 3, 4, 5];

// //map

// const double = number.map((number)=>{
//     return number*2;
// })

// console.log(double);

// //filter

// const even = number.filter((number)=> {
//     return number%2 === 0;
// })

// console.log(even);

// //reduce

// const sum = number.reduce((acc,curr)=>{
//     return acc + curr;
// },0);

// console.log(sum);

// const promise = new Promise((res, rej)=>{
//     rej("hello world");
// })

// promise.then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(err);
// })

// const url = require('url');

// const urlString = 'https://educative.com:8080/products?page=1&sort=desc#section1';
// const parsedURL = url.parse(urlString, true);

// console.log('Protocol:', parsedURL.protocol);
// console.log('Host:', parsedURL.host);
// console.log('Hostname:', parsedURL.hostname);
// console.log('Port:', parsedURL.port);
// console.log('Path:', parsedURL.path);
// console.log('Search:', parsedURL.search);
// console.log('Query:', parsedURL.query);
// console.log('Hash:', parsedURL.hash);

// let s='malayalam';
// let p='';
// for(let i=s.length-1;i>=0;i--)
// {
//    p+=s[i];
// }
// if(p==s)
// {
//     console.log('palindrome');
// }
// else{
//     console.log('not palindrome');
// }

// db.users.findOneAndUpdate({email},{$set:{password:spassword}},{new:true})
// let operations = ["--X","X++","X++"]

// let X = 0
//     for (let i = 0; i < operations.length; i++) {
//         operations[i];
//     }

//     console.log(X)

// let s = "3+2*2"

// let split = s.split("");
// n=2
// var isHappy = function(n) {
//     let sum = 0
//     do {
//         sum = 0
//         n = n.toString()
//         n = n.split("")
//         for(let i = 0; i < n.length; i++) {
//             n[i] = Number(n[i]);
//             sum = sum + Math.pow(n[i], 2)
//         }
//         if(sum === 1) {
//             return true
//         }
//         n = sum
//     } while(sum !== 1 && sum !== 4)
//     return false;

// };

// console.log(isHappy(n))   
let price  = 50000
let discount = 1
let last = Math.floor(price*100)/(100-discount)
console.log((last))