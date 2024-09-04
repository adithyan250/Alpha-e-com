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
// const arr = [-5, 2, 4, 6, 10];

// function search(arr, t) {
//   let left = 0;
//   let right = arr.length - 1;
//   while (left <= right) {
//     let middle = Math.floor((left + right) / 2);
//     if (t === arr[middle]) return middle
//     if (t < arr[middle]) {
//       right = middle - 1
//     }
//     else {
//       left = middle + 1;
//      }
//   }
//   return -1
// }
// console.log(search(arr, 10))
// console.log(search(arr, 6))
// console.log(search(arr, 20))
const obj = {

  _id: new ObjectId("66d7e6fd3453f01b97c172a2")
}
const id = obj._id
const string = id.str;
console.log(string);