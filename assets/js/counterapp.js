const counterDisplay = document.querySelector("#display");
const addButton = document.querySelector("#addButton");
const subButton = document.querySelector("#subButton");
const resetButton = document.querySelector("#reset");

let encounters = 0;

counterDisplay.addEventListener("change", function(e){
    encounters = counterDisplay.value;
    counterDisplay.value = encounters;
})

addButton.addEventListener("click", function(){
    encounters ++;
    counterDisplay.value = encounters;

})

subButton.addEventListener("click", function(){
    if(encounters > 0){
        encounters --;
        counterDisplay.value = encounters;
    }else{
        encounters = 0;
        counterDisplay.value = encounters;
    }
})

resetButton.addEventListener("click", reset);

function reset(){
    encounters = 0;
    counterDisplay.value = encounters;
}

document.addEventListener('keydown', function (event) {
    if (event.key === '+') {
        encounters ++;
        counterDisplay.value = encounters;
    }
    if (event.key === '-') {
        if(encounters > 0){
            encounters --;
            counterDisplay.value = encounters;
        }else{
            encounters = 0;
            counterDisplay.value = encounters;
        }
    }
  });