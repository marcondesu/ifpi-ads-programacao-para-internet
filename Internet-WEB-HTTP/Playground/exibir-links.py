import requests

# FAZER UMA REQUEST
requisicao = requests.get('https://api.github.com/events')

# MÉTODOS HTTP
## MÉTODO POST: utilizado para submeter uma entidade a um recurso específico, frequentemente causando uma mudança no estado do recurso ou efeitos colaterais no servidor.
post = requests.post('https://httpbin.org/post', data={'key': 'value'})

## MÉTODO PUT: substitui todas as atuais representações do recurso de destino pela carga de dados da requisição.
put = requests.put('https://httpbin.org/put', data={'key': 'value'})
print(put)

## MÉTODO DELETE: remove um recurso específico
delete = requests.delete('https://httpbin.org/delete')

## MÉTODO HEAD: solicita uma resposta assim como o método GET, porém sem conter o corpo da resposta
head = requests.head('https://httpbin.org/get')

## MÉTODO OPTIONS: descreve as opções de comunicação com o recurso de destino
options = requests.options('https://httpbin.org/get')
