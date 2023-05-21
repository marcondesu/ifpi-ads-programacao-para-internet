class Post {
    constructor(id, text, likes) {
        this.id = id;
        this.text = text
        this.likes = likes
    }
}

class Microblog {
    constructor() {
        this.posts = []
    }

    // Cria um post no Microblog
    create(post) {
        this.posts.push(post)
    }

    // Retorna o post com determinado id ou undefined
    retrieve(id) {
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == id) {
                return this.posts[i]
            }
        }
    }

    // Substitui um post de acordo com o id
    update(post) {
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == post.id) {
                this.posts[i] = post
            }
        }
    }

    delete(id) {
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == id) {
                this.posts.splice(i, 1)
            }
        }
    }

    retrieveAll() {
        return this.posts
    }
}

const post1 = new Post(1, 'Primeiro post', 3)
const post2 = new Post(2, 'Segundo post yuppi', 10)
// const post1_novo = new Post(1, 'Post substituído', 4)
const blog = new Microblog()

blog.create(post1)
blog.create(post2)

/* ############# SERVIDOR ############ */
const response = require('express')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (request, response) => {
    response.send("Hellow world! I'm 08_WEB-APIs")
})

app.get('/posts', (request, response) => {
    response.json(blog.retrieveAll())
})

app.get('/posts/:id', (request, response) => {
    const post = blog.retrieve(request.params.id)

    if (post) {
        response.json(post)
    } else {
        response.status(404).send()
    }
})

app.delete('/posts/:id', (request, response) => {
    const post = blog.retrieve(request.params.id)

    if (post) {
        blog.delete(post.id)
        response.status(204).send()
    } else {
        response.status(404).send()
    }
})

app.post('/posts', (request, response) => {
    const posts = blog.retrieveAll()
    const id = posts[posts.length - 1].id + 1

    const post = new Post(id, request.body.text, 0)
    blog.create(post)

    response.status(201).json(blog.retrieve(id))
})

app.put('/posts/:id', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
            const req_json = request.body

            blog.update(new Post(id, req_json.text, req_json.likes))
            response.status(200).send()
        }
    }

    response.status(404).send()
})

app.patch('/posts/:id', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
            const req_json = {
                "id": id,
                "text": request.body.text || posts[i].text,
                "likes": Number(request.body.likes) || posts[i].likes
            }

            blog.update(new Post(req_json.id, req_json.text, req_json.likes))
            response.status(200).send()
        }
    }

    response.status(404).send()
})

app.patch('/posts/:id/:like', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
            blog.posts[i].likes += Number(request.params.like)
            response.status(200).send()
        }
    }

    response.status(404).send()
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000...')
})
