import Vue from "vue"

Vue.filter("money", function(value) {
    return "$" + parseFloat(value).toFixed(2)
})
