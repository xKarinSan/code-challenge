// recursive
var sum_to_n_a = function(n) {
    if (n == 1){
        return 1;
    }
    return n + sum_to_n_a(n - 1);
};

// iterative
var sum_to_n_b = function(n) {
    var res = 0;
    for(var i = 1; i < n+1; i++){
        res += i;
    }
    return res
};

// reducer
var sum_to_n_c = function(n) {
    return [...Array(n + 1).keys()].reduce((accumulator,currentValue)=>{
        return accumulator + currentValue
    })
};