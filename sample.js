// Db.emplyee.aggregate([{$group:{_id:"$name",{$avg:"$salary"}}}])

// const payment  =  {
//     payment: {
//       razorpay_payment_id: 'pay_OsC0ZTHDExdH9t',
//       razorpay_order_id: 'order_OsC0SqqrmNhqdf',
//       razorpay_signature: 'bf6836f2e49b653a990d4b2017db1cb371525af780d7c9c00e61b6360871e6b2'
//     },
//     order: {
//       amount: '200000',
//       amount_due: '200000',
//       amount_paid: '0',
//       attempts: '0',
//       created_at: '1725257128',
//       currency: 'INR',
//       entity: 'order',
//       id: 'order_OsC0SqqrmNhqdf',
//       offer_id: '',
//       receipt: '10007',
//       status: 'created'
//     }
//   }


// FIBANACCI SEQUENCE
// const arr = [8, 20, -2, 4, -6];

// function insertionSort(arr) {
//   for(let i =1; i< arr.length;i++){
//     let numbertoInsert = arr[i];
//     let j =i-1
//     while(j>=0 && arr[j]>numbertoInsert){
//       arr[j+1] = arr[j];
//       j = j -1;
//     } 
//     arr[j+1] = numbertoInsert
//   }
// }

// insertionSort(arr)
// console.log(arr)

// console.log(recursiveSearch(arr, 10))
// console.log(recursiveSearch(arr, 6))
// console.log(recursiveSearch(arr, 20))
// const obj = {
//   _id: new ObjectId("66d7e6fd3453f01b97c172a2")
// }
// const id = obj._id
// const string = id.str;
// console.log(string);
// var d = Date.now();
// var date = new Date();
// d = d.toString().split(" ")
// console.log(d, date)

// for(let i = 0 ; i < 1000; i++){
//     console.log(i);
// }
