// let para1= document.createElement('p');
// para1.innerText ="Hey I'm red!";
// document.querySelector('body').append(para1);
// para1.classList.add('red');

// let h3 =document.createElement('h3');
// h3.innerText ="I'm a blue h3";
// document.querySelector('body').append(h3);
// h3.classList.add('blue');

// let div1 = document.createElement('div');
// let h1 = document.createElement('h1');
// div1.classList.add('div1');
// h1.innerText = "I'm in a div";
// let para2 = document.createElement('p');
// para2.innerText = "ME TOO!";
// div1.append(h1);
// div1.append(para2);                            //Hello

// document.querySelector('body').append(div1);

// let input = document.createElement('input');
// let button = document.createElement('button');
// button.innerText = "Click me";
// document.querySelector('body').append(input);
// document.querySelector('body').append(button);

// input.placeholder = "username";
// button.id = "btn";

// document.querySelector('#btn');
// button.classList.add('btn');

// let h1 = document.createElement('h1');
// h1.innerText = "DOM Practice";
// h1.classList.add('h1');
// document.querySelector('body').prepend(h1);

// let p1 = document.createElement('p');
// p1.innerHTML = `Apna College <b>Delta</b> Practice`;
// document.querySelector('body').append(p1);

// let btns = document.querySelectorAll('button');

// for(btn of btns){
//     // btn.onclick = sayHello;
//     // btn.onmouseenter = function(){
//     //     console.log("you entered a button");
//     // }
//     btn.addEventListener("click",sayHello);
//     btn.addEventListener("click",sayName);
// }

// function sayHello(){
//     alert("Hello");
// }
// function sayName(){
//         alert("Apna College");
//     }

let btn = document.querySelector("button");

btn.addEventListener("click", function(){
    let h3 = document.querySelector("h3");
    let randomcolor = getRandomColor();
    h3.innerText = randomcolor;

    let div = document.querySelector("div");
    div.style.backgroundColor = randomcolor;

    console.log("color updated");
});

function getRandomColor (){
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);

    let color = `rgb(${red} , ${green} , ${blue})`;
    return color;
}