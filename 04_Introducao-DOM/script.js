// selecione o botão usando o método getElementById
let botao = document.getElementById("botao")
let bt_limpar = document.getElementById("limpar")
let bt_surpresa = document.getElementById("surpresa")
let bt_happy = document.getElementById("happy")
let bt_sadness = document.getElementById("sadness")

// adicione um evento de clique ao botão
botao.addEventListener("click", function() {
    // selecione o parágrafo usando o método getElementById
    let paragrafo = document.getElementById("paragrafo")    
    // altere o texto do parágrafo
    paragrafo.textContent = "O texto deste parágrafo foi alterado!"
})

// Questão 3
bt_limpar.addEventListener("click", function() {
    // selecione o parágrafo usando o método getElementById
    let paragrafo = document.getElementById("paragrafo")
    // limpa o conteúdo do parágrafo
    paragrafo.textContent = ""
})

/* Questão 4
    - A propriedade textContent representa o texto do elemento. O innerHTML devolve o HTML daquele elemento contendo tudo incluindo o texto.
*/

// Questão 5
bt_surpresa.addEventListener("click", function() {
    const h1 = document.getElementsByTagName("h1")[0]

    h1.style.fontStyle = "italic"
})

// Questão 6
bt_happy.addEventListener("click", function() {
    document.body.style.backgroundColor = "black"
    document.body.style.color = "white"
})

bt_sadness.addEventListener("click", function() {
    document.body.style.backgroundColor = "white"
    document.body.style.color = "black"
})
