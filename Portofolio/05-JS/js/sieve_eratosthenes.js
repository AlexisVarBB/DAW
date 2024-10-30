/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";

  var array = new Array(n).fill(true),
    primes = [],
    i,
    j;
  
  array[0] = array[1] = false;
  for (i = 2; i * i < n; i++) {
    if (array[i]) { 
      for (j = i * i; j < n; j += i) {
        array[j] = false; 
      }
    }
  }

  for (i = 2; i < n; i++) {
    if (array[i]) {
      primes.push(i);
    }
  }

  return primes;
};

console.log(sieve(1000000));
