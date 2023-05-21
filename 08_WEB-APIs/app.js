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

    // Verifica se o post existe
    retrieve(id) {
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == id) {
                return id
            }
        }
    }

    // Retorna o post com determinado id ou undefined
    retrievePost(id) {
        const post = this.posts[this.retrieve(id)]

        if (post) {
            return post
        } else {
            return undefined
        }
    }

    // Substitui um post de acordo com o id
    update(post) {
        if (this.posts[this.retrieve(post.id) - 1]) {
            this.posts[post.id - 1] = post
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
    const id = Number(request.params.id)
    
    if (blog.retrieve(id)) {
        response.json(blog.retrieveAll()[id - 1])
    } else {
        response.status(404).send()
    }
})

app.delete('/posts/:id', (request, response) => {
    const id = Number(request.params.id)

    if (blog.retrieve(id)) {
        blog.delete(id)
        response.status(204).send()
    } else {
        response.status(404).send()
    }
})

app.post('/posts', (request, response) => {
    let posts = blog.retrieveAll()
    const id = posts[posts.length - 1].id + 1

    const post = new Post(id, request.body.text, 0)
    blog.create(post)

    response.status(201).json(blog.retrieveAll()[blog.retrieve(id) - 1])
})

app.put('/posts/:id', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)

    if (posts[blog.retrieve(id)]) {
        const req_json = request.body

        blog.update(new Post(id, req_json.text, req_json.likes))
        response.status(200).send()
    }

    response.status(404).send()
})

app.patch('/posts/:id', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)
    
    if (blog.retrieve(id)) {
        const req_json = {
            "id": posts[id - 1].id,
            "text": request.body.text || posts[id - 1].text,
            "likes": Number(request.body.likes) || posts[id - 1].likes
        }
        
        blog.update(new Post(req_json.id, req_json.text, req_json.likes))
        response.status(200).send()
    }

    response.status(404).send()
})

app.patch('/posts/:id/:like', (request, response) => {
    const posts = blog.retrieveAll()
    const id = Number(request.params.id)

    if (blog.retrieve(id)) {
        blog.posts[id - 1].likes += Number(request.params.like)
        response.status(200).send()
    }

    response.status(404).send()
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000...')
})
