import requests
import json

cep = input('CEP: ')
response = requests.get(f'https://viacep.com.br/ws/{cep}/json/', verify=False)

endereco = json.loads(response.content)

print(f"\n{endereco['logradouro']}, {endereco['complemento']}, bairro {endereco['bairro']}, {endereco['localidade']}-{endereco['uf']}")
