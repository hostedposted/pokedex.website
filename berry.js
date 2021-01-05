const pokedex1 = document.getElementById('pokedex1');

document.getElementById("searchbut1").addEventListener("click", function() {
    var input, filter, ul, li, a, i, value;
    input = document.getElementById('search1');
    filter = input.value.toUpperCase();
    ul = pokedex1;
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

var input = document.getElementById("search1");

input.addEventListener("keyup", function(event) {
    event.preventDefault();

    document.getElementById("searchbut1").click();
});



document.getElementById("clearbut1").addEventListener("click", function() {
    document.getElementById("search1").value = "";
    document.getElementById("searchbut1").click();
});