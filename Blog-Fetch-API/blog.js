const updateLike = async (id) => {
    const articles = document.querySelectorAll('#timeline article')
    
    articles.forEach(function(article) {
        if (Number(article.id) === id) {
            /* likeCount = article.querySelector('#like')
            const like = parseInt(likeCount.textContent) + 1
            likeCount.textContent = like + ' like(s)' */
            updatePost()

            return
        }
    })
}

async function updatePost(postId, updatedPost) {
    const url = `http://localhost:3000/posts/${postId}`
  
    const config = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
    }
  
    const response = await fetch('http://localhost:3000/posts', config)
    const updatedData = await response.json()
  
    console.log('Post atualizado: ', updatedData)
}  

window.onload = () => { // quando clica em add postagem
    const btnAddPost = document.getElementById('add-post')
    btnAddPost.onclick = addPost
    loadPosts()
}

async function addPost() { // cria a requisição (método)
    const newPost = {
        "title": document.getElementById('post-tile').value,
        "text": document.getElementById('post-text').value,
        "likes": 0
    }

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    }

    const response = await fetch('http://localhost:3000/posts', config)
    const post = await response.json()
    
    appendPost(post)
}

appendPost = (post) => {
    const template = document.getElementById('post-template')
    // const postElement = document.importNode(template.content, true)
    const postElement = template.content.cloneNode(true)

    const postTitle = postElement.querySelectorAll('h3')[0]
    postTitle.innerText = post.title
    
    const postArticle = postElement.querySelectorAll('article')[0]
    postArticle.setAttribute('id', post.id)

    const postItens = postElement.querySelectorAll('p')
    postItens[0].innerText = post.text
    postItens[1].innerText = post.likes + " like(s)"

    const btnLike = postElement.querySelector('#btn-like')
    btnLike.addEventListener('click', function() {
        updateLike(post.id)
    })

    document.getElementById('timeline').append(postElement)
}

/** Pega do "banco" e carrega as postagens de novo */
const loadPosts = async () => {
    const response = await fetch('http://localhost:3000/posts')
    const posts = await response.json()

    posts.forEach(post => {
        appendPost(post)
    })
}
