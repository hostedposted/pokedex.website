const pokedex2 = document.getElementById('pokedex2');

document.getElementById("searchbut2").addEventListener("click", function() {
    var input, filter, ul, li, a, i, value;
    input = document.getElementById('search2');
    filter = input.value.toUpperCase();
    ul = pokedex2;
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
       a = li[i].getElementsByTagName("t")[0];
       value = a.textContent || a.innerText;
       if (value.toUpperCase().indexOf(filter) == 0) {
          li[i].style.display = "";
       } else {
          li[i].style.display = "none";
       }
    }
});

var input = document.getElementById("search2");

input.addEventListener("keyup", function(event) {
    event.preventDefault();

    document.getElementById("searchbut2").click();
});



document.getElementById("clearbut2").addEventListener("click", function() {
    document.getElementById("search2").value = "";
    document.getElementById("searchbut2").click();
});